import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule],
    controllers: [AppointmentController],
    providers: [AppointmentService, PrismaService],
})
export class AppointmentModule {}
