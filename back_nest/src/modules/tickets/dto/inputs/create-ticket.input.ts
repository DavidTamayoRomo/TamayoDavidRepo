import { InputType, Int, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

@InputType()
export class CreateTicketInput {

  @ApiProperty()
  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  category:string;
  
  @ApiProperty()
  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  status:string;

  @ApiProperty()
  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  priority:string;

  @ApiProperty()
  @Field(type => String)
  @IsNotEmpty()
  @IsString()
  title:string;

  @ApiProperty()
  @Field(type => String, {nullable:true})
  @IsString()
  description?:string;

  @ApiProperty()
  @Field(type => Date, {nullable:true})
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Field(type => Date, {nullable:true})
  @IsDate()
  updatedAt: Date;
  
}
