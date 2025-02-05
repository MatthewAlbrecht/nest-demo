import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';

import { AddUserAttributesDto } from './dto/add-user-attributes-dto';
import { UsersService } from './users.service';
import { createPolicyGuard } from 'src/auth/policy.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(createPolicyGuard('user-attributes', 'modify'))
  @Post(':id/attributes')
  async addUserAttributes(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddUserAttributesDto,
  ) {
    return this.usersService.addUserAttributes(id, dto.attributes);
  }

  @UseGuards(createPolicyGuard('user-attributes', 'view'))
  @Get(':id/attributes')
  async getUserAttributes(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserAttributes(id);
  }
}
