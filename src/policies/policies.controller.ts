import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { createPolicyGuard } from 'src/auth/policy.guard';
import { AddPolicyDto } from './dto/add-policy-dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @UseGuards(createPolicyGuard('policies', 'modify'))
  @Post()
  async addPolicy(@Body() addPolicyDto: AddPolicyDto) {
    return this.policiesService.addPolicy(addPolicyDto);
  }

  @UseGuards(createPolicyGuard('policies', 'view'))
  @Get()
  async getPolicies() {
    return this.policiesService.getPolicies();
  }
}
