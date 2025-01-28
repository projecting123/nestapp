import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/db/user/user.service';
import { UserSchema } from 'src/db/schema';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
