import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ssl: true,
          type: configService.get('DB_TYPE') as 'mysql' | 'mariadb' | 'postgres' | 'cockroachdb',
          url: configService.get('DATABASE_URL'),
          synchronize: true,
          migrationsRun: true,
          autoLoadEntities: true,
          dropSchema: false,
          entities: [Ticket],
          migrations: ['./migrations/*{.ts,.js}'],
        };
      },
    }),
  ],
  
})
export class DatabaseModule { }
