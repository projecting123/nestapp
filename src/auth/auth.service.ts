import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { NewUserDto, LoginUserDto } from 'src/db/user.dto';
import { UserService } from 'src/db/user/user.service';
import { SignupResponse, LoginResponse } from 'src/types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signUp(user: NewUserDto): Promise<SignupResponse> {
    try {
      const existUser = await this.userService.getUserByEmail(user.email);
      const failResObj: SignupResponse = {
        ok: false,
        message: 'User already exist',
        iat: new Date().toISOString(),
      };
      if (existUser) return failResObj;
      const createdUser = await this.userService.createUser(user);
      const successResObj: SignupResponse = {
        ok: true,
        message: 'Signup successful',
        user: createdUser,
        iat: new Date().toISOString(),
      };
      return successResObj;
    } catch (error) {
      const errorResObj: SignupResponse = {
        ok: false,
        message: error.message,
        iat: new Date().toISOString(),
      };
      return errorResObj;
    }
  }

  async logIn(credentials: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.userService.getUserByEmail(credentials.email);

      // Incase of user not exist
      const failResObj: LoginResponse = {
        ok: false,
        message: 'User does not exist',
        iat: new Date().toISOString(),
      };
      if (!user) return failResObj;

      // Incase of incorrect password
      if (user.password !== credentials.password) {
        const invalidPassResObj: LoginResponse = {
          ok: false,
          message: 'Incorrect password',
          iat: new Date().toISOString(),
        };
        return invalidPassResObj;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET_KEY!,
      );
      const resObj: LoginResponse = {
        token: token,
        ok: true,
        message: 'Login successful',
        iat: new Date().toISOString(),
      };
      return resObj;
    } catch (error) {
      const resObj: LoginResponse = {
        ok: false,
        message: error.message,
        iat: new Date().toISOString(),
      };
      return resObj;
    }
  }
}
