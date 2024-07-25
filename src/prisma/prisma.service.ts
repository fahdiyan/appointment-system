import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
                { emit: 'event', level: 'error' },
            ],
            errorFormat: 'colorless',
        });
    }
    async onModuleInit() {
        this.$on('query', (e) => {
            console.log(e);
        });
        this.$on('info', (e) => {
            console.log(e);
        });
        this.$on('warn', (e) => {
            console.log(e);
        });

        this.$on('error', (e) => {
            console.log(e);
        });
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
