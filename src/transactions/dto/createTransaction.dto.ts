import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  debitedUsername: string;

  @IsNotEmpty()
  creditedUsername: string;

  @IsNotEmpty()
  value: string;
}
