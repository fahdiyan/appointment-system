import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Config } from '@prisma/client';

@Injectable()
export class ConfigService {
    constructor(private prisma: PrismaService) {}

    /**
     * Retrieves the configuration settings.
     * If no configuration is found in the database, sets default values for:
     * - slotDuration: 30
     * - maxSlotsPerAppointment: 1
     * - operationalStartTime: '09:00'
     * - operationalEndTime: '18:00'
     * - daysOff: []
     * - unavailableHours: []
     *
     * @returns A Promise that resolves to the retrieved or default configuration.
     */
    async getConfig(): Promise<Config> {
        const config = await this.prisma.config.findFirst();
        if (!config) {
            // Set the default configuration if there is no configuration in the database
            return this.prisma.config.create({
                data: {
                    slotDuration: 30,
                    maxSlotsPerAppointment: 1,
                    operationalStartTime: '09:00',
                    operationalEndTime: '18:00',
                    daysOff: [], //
                    unavailableHours: [],
                },
            });
        }
        return config;
    }

    /**
     * Updates the configuration settings.
     * If no existing configuration is found, creates a new configuration with the provided data.
     *
     * @param data - The partial configuration data to update or create.
     * @returns A Promise that resolves to the updated or newly created configuration.
     */
    async updateConfig(data: Partial<Config>): Promise<Config> {
        const config = await this.prisma.config.findFirst();
        if (!config) {
            return this.prisma.config.create({ data });
        }
        return this.prisma.config.update({
            where: { id: config.id },
            data,
        });
    }
}
