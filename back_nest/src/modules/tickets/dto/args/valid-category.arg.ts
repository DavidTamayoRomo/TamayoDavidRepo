import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { RepositoryCategoryEnum } from "src/constants/RepositoryEnums";

@ArgsType()
export class ValidCategoryArgs{

    @ApiProperty()
    @Field(()=>RepositoryCategoryEnum, {nullable:true})
    category:RepositoryCategoryEnum;

}