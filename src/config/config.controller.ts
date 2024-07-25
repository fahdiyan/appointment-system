import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from '@prisma/client';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}

    /**
     * Retrieves the configuration settings.
     *
     * @returns A Promise that resolves to the retrieved or default configuration.
     */
    @Get()
    async getConfig(): Promise<Config> {
        return this.configService.getConfig();
    }

    /**
     * Updates the configuration settings.
     *
     * @param data - The partial configuration data to update.
     * @returns A Promise that resolves to the updated configuration.
     */
    @Post()
    async updateConfig(@Body() data: Partial<Config>): Promise<Config> {
        return this.configService.updateConfig(data);
    }
}
