import { Body, Controller, Get, OnModuleInit, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, EventPattern, Transport } from '@nestjs/microservices';
//import { microserviceConfig } from '../../microServiceConfig';
import { TicketsService } from './tickets.service';
import { RepositoryStateEnum, RepositoryStateFakeEnum, RepositoryStateValueEnum } from 'src/constants/RepositoryEnums';
import { CreateTicketInput } from './dto/inputs/create-ticket.input';
import { Ticket } from './entities/ticket.entity';
import { SearchArgs } from '../common/dto/args/search.args';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController implements OnModuleInit {

    @Client({
        transport: Transport.KAFKA,
    
        options: {
            client: {
                brokers: [`${process.env.KAFKA_BROKER}:9091`],
            },
            consumer: {
                groupId: '1',
                allowAutoTopicCreation: true,
            },
        }
    })
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
    @ApiResponse({status:201, description: 'Create Ticket', type: Ticket})
    @ApiResponse({status:400, description: 'Bad request'})
    @ApiResponse({status:500, description: 'Internal server error'})
    async create(@Body() createTicketInput: CreateTicketInput): Promise<Ticket> {
        return await this.ticketsService.create(createTicketInput);
    }

    @Get(':id')
    @ApiResponse({status:200, description: 'Find Ticket', type: Ticket})
    @ApiResponse({status:400, description: 'Bad request'})
    @ApiResponse({status:500, description: 'Internal server error'})
    async findOne(@Param('id') id: string): Promise<Ticket>{
        return await this.ticketsService.findOne(id);
    }

    @Get('search')
    @ApiResponse({status:200, description: 'Search Tickets', type: [Ticket]})
    @ApiResponse({status:400, description: 'Bad request'})
    @ApiResponse({status:500, description: 'Internal server error'})
    async searchTickets(@Body() search: Search): Promise<Ticket[]>{
        return this.ticketsService.searchTickets(search.paginationArgs, search.searchArgs);
    }


}

interface Search {
    searchArgs: SearchArgs,
    paginationArgs: PaginationArgs
}
