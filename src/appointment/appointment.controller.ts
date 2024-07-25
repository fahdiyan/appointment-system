import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from '@prisma/client';

@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    /**
     * Retrieves available slots for appointments based on the provided date.
     * Throws BadRequestException if the date query parameter is missing.
     * @param date - The date for which available slots are requested.
     * @returns An array of available slots for the specified date.
     */
    @Get('available-slots')
    async getAvailableSlots(@Query('date') date: string) {
        if (!date) {
            throw new BadRequestException('Date query parameter is required');
        }
        return this.appointmentService.getAvailableSlots(date);
    }

    /**
     * Book an appointment based on the provided date and time.
     *
     * @param body An object containing the date and time for the appointment.
     * @returns A Promise that resolves to the booked Appointment.
     * @throws BadRequestException if date or time is missing.
     */
    @Post('book')
    async bookAppointment(@Body() body: { date: string; time: string }): Promise<Appointment> {
        const { date, time } = body;
        if (!date || !time) {
            throw new BadRequestException('Date and time are required');
        }
        return this.appointmentService.bookAppointment(date, time);
    }
}
