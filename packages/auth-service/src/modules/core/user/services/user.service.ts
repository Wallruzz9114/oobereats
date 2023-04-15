import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../../../data/entities/user.entity';
import { Logger } from '../../../logger/helpers';
import { AuthService } from '../../auth/services';
import { CreateUserInputDto, FindUsersInputDto, UpdatePasswordInputDto } from '../dtos';

@Injectable()
export class UserService {
  public constructor(
    private readonly _logger: Logger,
    private readonly _authService: AuthService,
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>
  ) {}

  public createUser = async (input: CreateUserInputDto): Promise<UserEntity> => {
    const userEntity = this._userRepository.create();
    const { email } = input;
    const existingUser = await this.getUserByEmail(email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('User with similar email already exists');
    }

    const password = await this.hashPassword(input.password);

    const saveEntity = {
      ...userEntity,
      ...input,
      password: password,
      username: input?.username.toLowerCase(),
      email: input?.email.toLowerCase(),
    };

    let user: UserEntity | null;

    try {
      user = await this._userRepository.save(saveEntity);
      this._logger.log(`user created successfully ${JSON.stringify(user)}`);
      return user;
    } catch (err) {
      this._logger.error(err);
      throw new ConflictException(`user already exist with same email`);
    }
  };

  public getUsers = async (): Promise<UserEntity[]> => this._userRepository.find({});

  public getUsersBy = async (input: FindUsersInputDto): Promise<UserEntity[]> => {
    const { email, username } = input;
    const users = await this._userRepository.find({
      where: [{ username: Like(`%${username}`) }, { email: Like(`%${email}`) }],
    });

    return users;
  };

  public getUserById = async (id: string): Promise<UserEntity | null> =>
    this._userRepository.findOne({ where: { id } });

  public getUserByEmail = async (email: string): Promise<UserEntity> =>
    await this._userRepository.findOne({ where: { email } });

  public updateRefreshToken = async (email: string, token: string) => {
    if (!token) {
      const user = await this.getUserByEmail(email.toLowerCase());
      const updatedUser = { ...user, refresh_token: null };
      return await this._userRepository.save(updatedUser);
    }

    const hashedToken = await this.hashData(token);
    const user = await this.getUserByEmail(email.toLowerCase());
    const updatedUser = { ...user, refresh_token: hashedToken };

    return await this._userRepository.save(updatedUser);
  };

  public updateUser = async (
    email: string,
    fields: UpdatePasswordInputDto
  ): Promise<UserEntity | undefined> => {
    if (fields.email) {
      const duplicatedUser = await this.getUserByEmail(fields.email);

      if (duplicatedUser) {
        fields.email = undefined;
      }
    }

    const fieldToUpdate: any = {};

    if (fields.password_update.new_password) {
      const shouldAllowUpdate = this._authService.login({
        email,
        password: fields.password_update.old_password,
      });

      if (shouldAllowUpdate) {
        fieldToUpdate.password = fieldToUpdate.password_update.new_password;
      }
    }

    for (const key in UpdatePasswordInputDto) {
      if (typeof fieldToUpdate[key] !== undefined && key !== undefined) {
        fieldToUpdate[key] = UpdatePasswordInputDto[key];
      }
    }

    let user: UserEntity | undefined | null;

    if (Object.entries(fieldToUpdate).length > 0) {
      user = await this.getUserByEmail(email.toLowerCase());
      const saveEntity = { ...user, ...fieldToUpdate };
      await this._userRepository.save(saveEntity);
    }

    user = await this.getUserByEmail(email);
    return user;
  };

  private hashPassword = async (password: string): Promise<string> =>
    await bcrypt.hash(password, process.env.SALT_ROUNDS);

  private hashData = (token: string): Promise<string> =>
    bcrypt.hash(token, process.env.SALT_ROUNDS);
}
