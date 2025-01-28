import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import * as express from 'express';
import { LoginResponse, MeResponse, SignupResponse } from '../../src/types';
import { UserDocument } from 'src/db/schema';
import { NewUserDto } from 'src/db/user.dto';
import { UserService } from 'src/db/user/user.service';
import { CustomRequest } from 'src/middleware';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {}

  @Get('/getuser')
  async index(@Query('email') email: string): Promise<UserDocument> {
    const user = await this.user.getUserByEmail(email);
    return user;
  }

  @Post('/signup')
  async create(@Body() user: NewUserDto): Promise<SignupResponse> {
    const response = await this.auth.signUp(user);
    return response;
  }

  @Post('/login')
  async login(
    @Body() user: NewUserDto,
    @Res() res: express.Response,
  ): Promise<LoginResponse> {
    const response = await this.auth.logIn(user);
    if (response.ok) {
      res
        .cookie('cr_id', response.token, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        .json(response);
    } else return response;
  }

  @Get('/logout')
  async logout(@Res() res: express.Response) {
    res.clearCookie('cr_id').json({ ok: true, message: 'Logout successful' });
  }

  @Get('/isAuthorized')
  async isAuthorized(@Req() req: CustomRequest) {
    return req.isAuthorized;
  }

  @Get('me')
  async me(@Req() req: CustomRequest) {
    const meResponse: MeResponse = {
      user: req.user,
      ok: true,
      iat: new Date().toISOString(),
    };
    return meResponse;
  }
}
