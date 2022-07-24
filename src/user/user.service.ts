import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto, LoginUserDto, UserUpdateDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: UserDto): Promise<UserEntity> {
    const dtoError = {
      errors: { 'credentials must be provided': 'not found' },
    };
    if (!dto) {
      throw new HttpException(dtoError, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const errorResponse = { errors: {} };
    const userByEmail = await this.userRepository.findOne({
      email: dto.email,
    });
    const userByUserName = await this.userRepository.findOne({
      email: dto.username,
    });
    if (userByEmail) {
      errorResponse.errors['email'] = 'Email has already been taken';
    }
    if (userByUserName) {
      errorResponse.errors['username'] = 'This Username has already been taken';
    }
    if (userByEmail || userByUserName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, dto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(dto: LoginUserDto): Promise<UserEntity> {
    const dtoError = {
      errors: { 'credentials must be provided': 'not found' },
    };
    if (!dto) {
      throw new HttpException(dtoError, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const userByEmail = await this.userRepository.findOne(
      { email: dto.email },
      {
        select: ['id', 'username', 'bio', 'image', 'password', 'email'],
      },
    );
    const errorResponse = { errors: { 'email or password': 'is invalid' } };
    if (!userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(dto.password, userByEmail.password);

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    delete userByEmail.password;
    return userByEmail;
  }

  async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async updateUser(forUpdate: UserUpdateDto, id: number): Promise<UserEntity> {
    const user = await this.findUserById(id);
    if (forUpdate.password) {
      forUpdate.password = await hash(forUpdate.password, 10);
    }
    Object.assign(user, forUpdate);
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      'iLoveNitzan',
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
