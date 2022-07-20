import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getUserProfile(
    currentUserId: number,
    username: string,
  ): Promise<ProfileType> {
    const user = await this.getProfileByUserName(username);
    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });
    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.getProfileByUserName(userName);
    if (user.id === currentUserId) {
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }
    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });
    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }
    return { ...user, following: true };
  }

  async unfollowProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.getProfileByUserName(userName);

    if (user.id === currentUserId) {
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });
    return { ...user, following: false };
  }

  async getProfileByUserName(username: string) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
