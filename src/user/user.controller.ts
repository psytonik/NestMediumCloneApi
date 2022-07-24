import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, LoginUserDto, UserUpdateDto } from './dto/user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserDecorator } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { BackEndValidationPipe } from '../shared/pipes/backEndValidation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @ApiBody({ type: UserDto })
  @ApiOkResponse({ status: 200, type: UserEntity })
  @UsePipes(new BackEndValidationPipe())
  async createUser(
    @Body('user') createUserDto: UserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('user/login')
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ status: 200, type: UserEntity })
  @UsePipes(new BackEndValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    console.log(loginUserDto);
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(
    @UserDecorator() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @UserDecorator('id') currentUserId: number,
    @Body('user') userUpdateDto: UserUpdateDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      userUpdateDto,
      currentUserId,
    );
    return this.userService.buildUserResponse(user);
  }
}
