import { ArgsType, Field } from "@nestjs/graphql";
import { RepositoryCategoryEnum } from "src/constants/RepositoryEnums";

@ArgsType()
export class ValidCategoryArgs{

    @Field(()=>RepositoryCategoryEnum, {nullable:true})
    category:RepositoryCategoryEnum;

}