import { IsDate, IsEnum, IsInt, IsNumber, IsString, Length } from "class-validator";
import { AccountType, statusType } from "src/constants/RepositoryEnums";

export class ReadFileDto {
    @IsInt()
    id: number;
  
    @IsNumber()
    balance: number;
  
    @IsEnum(AccountType)
    account: AccountType;
  
    @IsString()
    @Length(0, 500)
    description: string;
  
    @IsEnum(statusType)
    status: statusType;
  
    @IsDate()
    date: Date;
  }