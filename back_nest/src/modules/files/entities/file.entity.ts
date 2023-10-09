import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('file')
@ObjectType()
export class File {

    @Field(type => ID)
    @PrimaryGeneratedColumn('identity')
    id: string;

    @Field(type => Float)
    @Column()
    balance: number;

    @Field(type => String)
    @Column()
    account: string;

    @Column()
    @Field(type => String, { nullable: true })
    description?: string;

    @Column()
    @Field(type => String)
    status: string;

    @Field(type => Date, { nullable: true })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt: Date;

}
