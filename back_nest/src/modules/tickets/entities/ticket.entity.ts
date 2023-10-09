import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ticket')
@ObjectType()
export class Ticket {
  
  @ApiProperty({
    example:'11df026f-650c-4938-97ac-b20675603cb9',
    description:'Ticket ID',
    uniqueItems:true
  })
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id:string;

  @ApiProperty()
  @Column()
  @Field(type => String)
  category:string;

  @ApiProperty()
  @Column()
  @Field(type => String)
  status:string;

  @ApiProperty()
  @Column()
  @Field(type => String)
  priority:string;

  @ApiProperty()
  @Column()
  @Field(type => String)
  title:string;

  @ApiProperty()
  @Column()
  @Field(type => String, {nullable:true})
  description?:string;

  @ApiProperty()
  @Field(type => Date, {nullable:true})
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Field(type => Date, {nullable:true})
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)',name: 'updated_at' })
  updatedAt: Date;



}
