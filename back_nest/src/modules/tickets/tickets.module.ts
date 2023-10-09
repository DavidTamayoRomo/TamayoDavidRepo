import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsResolver } from './tickets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { StateService } from 'src/services/state/state.service';
import { HttpModule } from '@nestjs/axios';
import { TicketsController } from './tickets.controller';
@Module({
  
  imports:[
    TypeOrmModule.forFeature([Ticket]),
    HttpModule
  ],
  providers: [TicketsResolver, TicketsService, StateService],
  controllers: [TicketsController],
})
export class TicketsModule {}
