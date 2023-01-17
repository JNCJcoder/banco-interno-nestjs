import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  async create(@Req() req: any, @Body() body: CreateTransactionDto) {
    return await this.transactionsService.create(req.user.username, body);
  }

  @Get()
  async findAll(@Req() req: any) {
    return await this.transactionsService.findAll(req.user.accountId);
  }
}
