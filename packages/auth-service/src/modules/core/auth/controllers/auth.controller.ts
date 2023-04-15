import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from '../../../logger/helpers';
import { AuthResponseDto, LoginDto } from '../dtos';
import { AccessTokenGuard, RefreshTokenGuard } from '../guards';
import { AuthService } from '../services';

@ApiBearerAuth('authorization')
@Controller('auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  })
)
@ApiTags('auth')
export class AuthController {
  public constructor(
    private readonly _authService: AuthService,
    private readonly _logger: Logger
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'User login api returns access token' })
  @ApiOkResponse({
    description: 'User has been logged in successfully',
    type: AuthResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConsumes('application/json')
  @Post('/login')
  public async login(@Body() body: LoginDto) {
    this._logger.info(JSON.stringify(body));
    return this._authService.login(body);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @Post('/logout')
  public async logout(@Req() req: any) {
    const user = req.user;
    await this._authService.logout(user);
    return null;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @Post('/refresh')
  public async refreshToken(@Req() req: any) {
    const user = req.user;
    return await this._authService.refreshToken(user);
  }
}
