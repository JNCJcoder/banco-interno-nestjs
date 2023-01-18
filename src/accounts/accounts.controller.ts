import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private accountsService: AccountsService) { }

  @Get('/balance')
  async findOne(@Req() req: any) {
    return await this.accountsService.findOne(req.accountId);
  }
}
