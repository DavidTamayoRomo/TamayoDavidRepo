import { CreateTicketInput } from './create-ticket.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
  
  @Field(type => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;

}
