import { CreateTicketInput } from './create-ticket.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
  
  @ApiProperty()
  @Field(type => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;

}
