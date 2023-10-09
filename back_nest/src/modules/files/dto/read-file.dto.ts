import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsNumber, IsString, Length } from "class-validator";
import { AccountType, statusType } from "src/constants/RepositoryEnums";

export class ReadFileDto {

  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNumber()
  balance: number;

  @ApiProperty()
  @IsEnum(AccountType)
  account: AccountType;

  @ApiProperty()
  @IsString()
  @Length(0, 500)
  description: string;

  @ApiProperty()
  @IsEnum(statusType)
  status: statusType;

  @ApiProperty()
  @IsDate()
  date: Date;
}