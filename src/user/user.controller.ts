import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('user')
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Get('users')
  async getAllUsers(): Promise<any> {
    return ['user2'];
  }
}
