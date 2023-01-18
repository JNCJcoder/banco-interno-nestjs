import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty()
  debitedUsername: string;

  @IsNotEmpty()
  @ApiProperty()
  creditedUsername: string;

  @IsNotEmpty()
  @ApiProperty()
  value: string;
}
