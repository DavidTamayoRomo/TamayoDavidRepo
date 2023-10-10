import { Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { CreateTicketInput } from './dto/inputs/create-ticket.input';
import { UpdateTicketInput } from './dto/inputs/update-ticket.input';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { StateService } from 'src/services/state/state.service';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
//import { microserviceConfig } from '../../microServiceConfig';
import { RepositoryStateEnum, RepositoryStateFakeEnum, RepositoryStateValueEnum } from 'src/constants/RepositoryEnums';
import { CustomExceptionFilter } from 'src/middleware/custom-exception-filter';

@Injectable()
export class TicketsService {

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
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private stateService: StateService
  ) {

  }

  async create(createTicketInput: CreateTicketInput): Promise<Ticket> {
    // paso 1: Guardar el ticket con estado pending
    let state: string = createTicketInput.status;
    createTicketInput.status = RepositoryStateValueEnum[RepositoryStateEnum.pending];
    const newTicket = this.ticketRepository.create(createTicketInput);
    console.log("ESTADO QUE SE REQUIERE", state);
    let ticket = await this.ticketRepository.save(newTicket);
    //category incident o support | “1” verified o “2” approved

    const valorNumerico = Object.keys(RepositoryStateFakeEnum).find(
      (key) => RepositoryStateFakeEnum[key] === state
    );
      console.log(valorNumerico);

    /* if (createTicketInput.category == 'incident' || createTicketInput.category == 'support') {

    }

    if (createTicketInput.category == 'reject') {
      
    } */

    this.stateService.getStatusCodeById(parseInt(valorNumerico)).subscribe((resp: any) => {
      let dato = JSON.parse(JSON.stringify(resp.data));
      console.log("response", dato);
      console.log("response", dato.state);
      // paso 2: Enviamos a kafka el id y estado que se debe poner
      this.client.emit<string>('technical_support_tickets', JSON.stringify({ id: ticket.id, status: dato.state }));
    })
    return ticket;
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Ticket[]> {
    const { limit, offset } = paginationArgs;
    const queryBuilder = this.ticketRepository.createQueryBuilder()
      .take(limit)
      .skip(offset);

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not exist`)
    return ticket;
  }

  @UseFilters(new CustomExceptionFilter())
  async update(id: string, updateTicketInput: UpdateTicketInput): Promise<Ticket> {
    const ticket = await this.ticketRepository.preload(updateTicketInput);
    console.log(ticket);
    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not exist`);
    //if (!ticket) throw new CustomException(`Ticket with id ${id} not exist`);
    return await this.ticketRepository.save(ticket);
  }

  async remove(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket)
    return { ...ticket, id };
  }


  async searchTickets(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Ticket[]> {
    const { limit, offset } = paginationArgs;
    const { start, end, priority, category } = searchArgs;

    const queryBuilder = this.ticketRepository.createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (start && end) {
      queryBuilder.andWhere('created_at BETWEEN :start AND :end', { start, end });
    }

    if (priority) {
      queryBuilder.andWhere('priority = :priority', { priority: priority });
    }

    if (category) {
      queryBuilder.andWhere('category = :category', { category: category });
    }

    return queryBuilder.getMany();
  }


  async count(): Promise<number> {
    return await this.ticketRepository.count();
  }

}
