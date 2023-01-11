import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return await this.transactionsService.create(req.user.username, body);
  }

  @Get()
  async findAll(@Req() req: any) {
    return await this.transactionsService.findAll(req.user.accountId);
  }
}
