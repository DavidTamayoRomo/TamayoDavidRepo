import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, Min } from "class-validator";


@ArgsType()
export class SearchArgs {
    
    @Field( ()=> Date, {nullable:true})
    @IsOptional()
    start?:Date;

    @Field( ()=> Date, {nullable:true})
    @IsOptional()
    end?:Date;

    @Field(()=>[String], {nullable:true})
    @IsOptional()
    priority?:[String];

    @Field(()=>[String], {nullable:true})
    @IsOptional()
    category?:[String];
    
}