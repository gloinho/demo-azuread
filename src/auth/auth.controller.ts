import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('/login')
  async login() {}

  @Post('/redirect')
  async redirect() {}

  @Get('/logout')
  async logout() {}
}
