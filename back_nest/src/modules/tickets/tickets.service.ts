import { Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { CreateTicketInput } from './dto/inputs/create-ticket.input';
import { UpdateTicketInput } from './dto/inputs/update-ticket.input';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { StateService } from '../../services/state/state.service';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
//import { microserviceConfig } from '../../microServiceConfig';
import { RepositoryStateEnum, RepositoryStateFakeEnum, RepositoryStateValueEnum } from '../../constants/RepositoryEnums';
import { CustomExceptionFilter } from '../../middleware/custom-exception-filter';

@Injectable()
export class TicketsService {

  @Client({
    transport: Transport.KAFKA,

    options: {
        client: {
            brokers: [`localhost:9091`],
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
    let ticket = await this.ticketRepository.save(createTicketInput);
    //category incident o support | “1” verified o “2” approved
    const valorNumerico = Object.keys(RepositoryStateFakeEnum).find(
      (key) => RepositoryStateFakeEnum[key] === state
    );
    const resp = await this.stateService.getStatusCodeById(+valorNumerico)
    this.client.emit<string>('technical_support_tickets', JSON.stringify({ id: ticket.id, status: resp.state }));
    return ticket;
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Ticket[]> {
    const { limit, offset } = paginationArgs;
    const queryBuilder = this.ticketRepository.createQueryBuilder()
      .orderBy("created_at", "DESC")
      .take(limit)
      .skip(offset);
    return queryBuilder.getMany();
  }

  async findOne(id: any): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne(id);
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
      let listaPriority = priority;
      listaPriority.forEach((item: string, index: number) => {
        queryBuilder.orWhere('priority = :priority' + index, { ['priority' + index]: item });
      });
      //queryBuilder.andWhere('priority = :priority', { priority: priority });
    }

    if (category) {
      let listaCategory = category;
      listaCategory.forEach((item: string, index: number) => {
        queryBuilder.orWhere('category = :category' + index, { ['category' + index]: item });
      });
      //queryBuilder.andWhere('category = :category', { category: category });
    }

    return queryBuilder.getMany();
  }


  async count(): Promise<number> {
    return await this.ticketRepository.count();
  }

}
