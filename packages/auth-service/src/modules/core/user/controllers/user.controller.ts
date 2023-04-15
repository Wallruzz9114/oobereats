import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../../../data/entities/user.entity';
import { Logger } from '../../../logger/helpers';
import { AccessTokenGuard, RoleAllowed, Roles, RolesGuard } from '../../auth/guards';
import { CreateUserInputDto, FindUsersInputDto, UserResponseDto } from '../dtos';
import { UserService } from '../services';

@ApiBearerAuth('authorization')
@Controller('user')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags('users')
export class UserController {
  public constructor(
    private readonly _userService: UserService,
    private readonly _logger: Logger
  ) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(Roles['system-admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResponseDto, description: '' })
  @ApiOperation({ description: 'find all users' })
  @ApiConsumes('application/json')
  @Get('/')
  public async getUsers(): Promise<UserEntity[]> {
    return this._userService.getUsers();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(Roles['system-admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResponseDto, description: '' })
  @ApiOperation({ description: 'find users based on params' })
  @ApiConsumes('application/json')
  @Get('/search')
  public async getUsersBy(@Param() param: FindUsersInputDto) {
    this._logger.info(JSON.stringify(param));
    return this._userService.getUsersBy(param);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiOkResponse({ type: UserResponseDto, description: '' })
  @ApiOperation({ description: 'create user api endpoint' })
  @ApiConsumes('application/json')
  @Post('')
  public async createUser(@Body() body: CreateUserInputDto): Promise<UserEntity> {
    this._logger.info(JSON.stringify(body));
    return this._userService.createUser(body);
  }
}
