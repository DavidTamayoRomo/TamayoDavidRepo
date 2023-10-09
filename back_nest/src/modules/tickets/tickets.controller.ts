import { Body, Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka, EventPattern } from '@nestjs/microservices';
import { microserviceConfig } from 'src/microServiceConfig';
import { TicketsService } from './tickets.service';
import { RepositoryStateEnum, RepositoryStateFakeEnum, RepositoryStateValueEnum } from 'src/constants/RepositoryEnums';
import { CreateTicketInput } from './dto/inputs/create-ticket.input';

@Controller('tickets')
export class TicketsController implements OnModuleInit {

    @Client(microserviceConfig)
    client: ClientKafka;

    constructor(
        private ticketsService: TicketsService
    ) { }

    onModuleInit() {
        const requestPatterns = [
            'technical_support_tickets',
        ];

        requestPatterns.forEach(pattern => {
            this.client.subscribeToResponseOf(pattern);
        });
    }

    @EventPattern('technical_support_tickets')
    async handleEntityCreated(payload: any) {
        //TODO: validar que se envié un UUID
        payload.status = RepositoryStateEnum[payload.status];
        this.ticketsService.update(payload.id, payload);
    }


    @Post()
    create(@Body() createTicketInput: CreateTicketInput) {
        return this.ticketsService.create(createTicketInput);
    }


}
