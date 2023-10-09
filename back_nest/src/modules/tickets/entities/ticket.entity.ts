import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ticket')
@ObjectType()
export class Ticket {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id:string;

  @Column()
  @Field(type => String)
  category:string;

  @Column()
  @Field(type => String)
  status:string;

  @Column()
  @Field(type => String)
  priority:string;

  @Column()
  @Field(type => String)
  title:string;

  @Column()
  @Field(type => String, {nullable:true})
  description?:string;

  @Field(type => Date, {nullable:true})
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
  createdAt: Date;

  @Field(type => Date, {nullable:true})
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)',name: 'updated_at' })
  updatedAt: Date;



}
