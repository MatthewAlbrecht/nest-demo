import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { createPolicyGuard } from 'src/auth/policy.guard';
import { CreateOrganizationDto } from './dto/create-organization-dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(createPolicyGuard('organizations', 'view'))
  async getOrganizations() {
    return this.organizationsService.getOrganizations();
  }

  @Post()
  @UseGuards(createPolicyGuard('organizations', 'add'))
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }
}
