import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getOrganizations() {
    return this.organizationsService.getOrganizations();
  }
}
