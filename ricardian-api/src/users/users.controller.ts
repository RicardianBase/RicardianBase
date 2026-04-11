import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile (display name, email, avatar)' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  updateNotifications(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return this.usersService.updateNotifications(userId, dto);
  }

  @Get('resolve/:identifier')
  @ApiOperation({
    summary: 'Resolve a Ricardian party by username or wallet address',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Username (with or without @) or wallet address',
  })
  resolveIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.resolveIdentifier(identifier);
  }
}
