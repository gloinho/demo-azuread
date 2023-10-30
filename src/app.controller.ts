import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/azure.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/groups')
  @UseGuards(AuthGuard)
  async getGroups(@Req() req) {
    return await this.appService.getGroups(req);
  }
}
