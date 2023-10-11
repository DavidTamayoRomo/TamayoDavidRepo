import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/inputs/create-ticket.input';
import { UpdateTicketInput } from './dto/inputs/update-ticket.input';
import { HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { ValidCategoryArgs } from './dto/args/valid-category.arg';
import { TicketResponse } from './dto/ticket-response.dto';

@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) { }

  @Mutation(() => Ticket)
  async createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput
  ): Promise<Ticket> {
    return this.ticketsService.create(createTicketInput);
  }

  @Query(() => TicketResponse, { name: 'tickets' })
  async findAll(
    @Args() validCategory: ValidCategoryArgs, //TODO: revisar porque no valida cuando se lista todos
    @Args() paginationArgs: PaginationArgs
  ): Promise<TicketResponse> {
    try {
      const total = await this.ticketsService.count();
      const data = await this.ticketsService.findAll(paginationArgs);
      return { data, total };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  @Query(() => Ticket, { name: 'ticket' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Mutation(() => Ticket)
  async updateTicket(@Args('updateTicketInput') updateTicketInput: UpdateTicketInput): Promise<Ticket> {
    return this.ticketsService.update(updateTicketInput.id, updateTicketInput);
  }

  @Mutation(() => Ticket)
  async removeTicket(@Args('id', { type: () => ID }) id: string): Promise<Ticket> {
    return this.ticketsService.remove(id);
  }

  @Mutation(() => TicketResponse)
  async searchTickets(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<TicketResponse> {
    const total = await this.ticketsService.count();
    const data = await this.ticketsService.searchTickets(paginationArgs, searchArgs);
    return { data, total }
  }

}
