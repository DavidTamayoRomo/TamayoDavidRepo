import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

@InputType()
export class CreateTicketInput {

  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  category:string;
  
  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  status:string;

  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  priority:string;

  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  title:string;

  @Field(type => String, {nullable:true})
  @IsString()
  description?:string;

  @Field(type => Date, {nullable:true})
  @IsDate()
  createdAt: Date;

  @Field(type => Date, {nullable:true})
  @IsDate()
  updatedAt: Date;
  
}
