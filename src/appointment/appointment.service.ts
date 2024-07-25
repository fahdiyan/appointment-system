import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from 'src/config/config.service';
import { Appointment } from '@prisma/client';
import * as moment from 'moment-timezone';

@Injectable()
export class AppointmentService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {}

    /**
     * Retrieves available slots for appointments on a given date based on the configuration settings.
     * Checks for weekends and days off, then generates available time slots within operational hours.
     * Considers unavailable hours and existing appointments to determine slot availability.
     * @param date The date for which to retrieve available slots in 'YYYY-MM-DD' format.
     * @returns An array of available slots with date, time, and availability status.
     */
    async getAvailableSlots(date: string): Promise<any[]> {
        const config = await this.configService.getConfig();
        const timezone = config.timezone || 'UTC';
        const slots = [];
        const dateObj = moment.tz(date, timezone).startOf('day') as any;

        // Check if the date is a weekend
        const isWeekend = dateObj.day() === 0 || dateObj.day() === 6;
        if (isWeekend) {
            return slots; // Return empty slots for weekends
        }

        // Check if the date is a day off
        const listDaysOff = config.daysOff as string[];
        const isDayOff = listDaysOff.some((day) => {
            return moment.tz(day, timezone).isSame(dateObj, 'day');
        });

        if (isDayOff) {
            return slots; // Return empty slots for day off
        }

        const [startHour, startMinute] = config.operationalStartTime.split(':').map(Number);
        const [endHour, endMinute] = config.operationalEndTime.split(':').map(Number);

        let currentSlot = moment.tz(dateObj, timezone).set({ hour: startHour, minute: startMinute });
        const endTime = moment.tz(dateObj, timezone).set({ hour: endHour, minute: endMinute });

        while (currentSlot.isBefore(endTime)) {
            const endSlot = currentSlot.clone().add(config.slotDuration, 'minutes');

            // Check if the slot is within unavailable hours
            const listUnavailableHours = config.unavailableHours as string[];
            const isUnavailable = listUnavailableHours.some((period) => {
                const [periodStart, periodEnd] = period.split('-');
                const [startHour, startMinute] = periodStart.split(':').map(Number);
                const [endHour, endMinute] = periodEnd.split(':').map(Number);

                const unavailableStart = moment.tz(dateObj, timezone).set({ hour: startHour, minute: startMinute });
                const unavailableEnd = moment.tz(dateObj, timezone).set({ hour: endHour, minute: endMinute });

                return (
                    (currentSlot.isSameOrAfter(unavailableStart) && currentSlot.isBefore(unavailableEnd)) ||
                    (endSlot.isAfter(unavailableStart) && endSlot.isSameOrBefore(unavailableEnd))
                );
            });

            if (!isUnavailable) {
                const existingAppointments = await this.prisma.appointment.findMany({
                    where: {
                        date: dateObj,
                        startTime: currentSlot.toDate(),
                    },
                });

                slots.push({
                    date: dateObj.format('YYYY-MM-DD'),
                    time: currentSlot.format('HH:mm:ss'),
                    available_slots: existingAppointments.length < config.maxSlotsPerAppointment ? 1 : 0,
                });
            }

            currentSlot = endSlot;
        }

        return slots;
    }

    /**
     * Books an appointment based on the provided date and time.
     * Validates the date, time, and availability before booking.
     * Throws BadRequestException for weekends, day offs, and unavailable hours.
     * @param date The date of the appointment in 'YYYY-MM-DD' format.
     * @param time The time of the appointment in 'HH:mm' format.
     * @returns The booked Appointment object if successful.
     */
    async bookAppointment(date: string, time: string): Promise<Appointment> {
        const config = await this.configService.getConfig();
        const timezone = config.timezone || 'UTC';
        const dateObj = moment.tz(date, timezone).startOf('day') as any;
        const startTime = moment
            .tz(dateObj, timezone)
            .set({ hour: parseInt(time.split(':')[0]), minute: parseInt(time.split(':')[1]) });
        const endTime = startTime.clone().add(config.slotDuration, 'minutes');

        // Check if the date is a weekend
        const isWeekend = dateObj.day() === 0 || dateObj.day() === 6;
        if (isWeekend) {
            throw new BadRequestException('Cannot book appointments on weekends.');
        }

        // Check if the date is a day off
        const listDaysOff = config.daysOff as string[];
        const isDayOff = listDaysOff.some((day) => {
            return moment.tz(day, timezone).isSame(dateObj, 'day');
        });

        if (isDayOff) {
            throw new BadRequestException('Cannot book appointments on a day off.');
        }

        // Check if the time is within unavailable hours
        const listUnavailableHours = config.unavailableHours as string[];
        const isUnavailable = listUnavailableHours.some((period) => {
            const [periodStart, periodEnd] = period.split('-');
            const [startHour, startMinute] = periodStart.split(':').map(Number);
            const [endHour, endMinute] = periodEnd.split(':').map(Number);

            const unavailableStart = moment.tz(dateObj, timezone).set({ hour: startHour, minute: startMinute });
            const unavailableEnd = moment.tz(dateObj, timezone).set({ hour: endHour, minute: endMinute });

            return (
                (startTime.isSameOrAfter(unavailableStart) && startTime.isBefore(unavailableEnd)) ||
                (endTime.isAfter(unavailableStart) && endTime.isSameOrBefore(unavailableEnd))
            );
        });

        if (isUnavailable) {
            throw new BadRequestException('Cannot book during unavailable hours.');
        }

        const existingAppointments = await this.prisma.appointment.findMany({
            where: {
                date: dateObj,
                startTime: startTime.toDate(),
            },
        });

        if (existingAppointments.length >= config.maxSlotsPerAppointment) {
            throw new BadRequestException('Slot is already fully booked.');
        }

        return this.prisma.appointment.create({
            data: {
                date: dateObj,
                startTime: startTime.toDate(),
                endTime: endTime.toDate(),
            },
        });
    }
}
