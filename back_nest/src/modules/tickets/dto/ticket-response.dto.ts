import { Field, ObjectType } from "@nestjs/graphql";
import { Ticket } from "../entities/ticket.entity";

@ObjectType()
export class TicketResponse {
  @Field(() => [Ticket])
  data: Ticket[];

  @Field()
  total: number;
}