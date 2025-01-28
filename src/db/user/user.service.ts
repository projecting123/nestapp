import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/db/schema';
import { NewUserDto } from 'src/db/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}

  // Creating users
  async createUser(user: NewUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(user);
      return createdUser.save();
    } catch (error) {
      console.log(error.name);
    }
  }

  // Getting users
  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  
  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Updating users
  async updateUserById(id: string, user: User): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async updateUserByEmail(
    email: string,
    user: NewUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate({ email }, user, { new: true })
      .exec();
  }

  // Deleting users
  async deleteUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async deleteUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOneAndDelete({ email }).exec();
  }
}
