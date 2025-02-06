import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post(':roleName')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiParam({
    name: 'roleName',
    required: true,
    description: 'Name of the role',
  })
  @ApiResponse({
    status: 201,
    description: ResponseMessages.ROLE.CREATED,
  })
  @ApiResponse({
    status: 400,
    description: ResponseMessages.GENERAL.INVALID_DATA,
  })
  async createRole(
    @Param('roleName') roleName: string,
  ): Promise<{ message: string; data: Role }> {
    if (!roleName) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newRole = await this.rolesService.createRole(roleName);
    return {
      message: ResponseMessages.ROLE.CREATED,
      data: newRole,
    };
  }

  @Get(':roleName')
  @ApiOperation({ summary: 'Get a role by name' })
  @ApiParam({
    name: 'roleName',
    required: true,
    description: 'Name of the role',
  })
  @ApiResponse({
    status: 200,
    description: ResponseMessages.ROLE.FETCHED,
  })
  @ApiResponse({ status: 400, description: 'Invalid role name.' })
  async getOneRoleByName(
    @Param('roleName') roleName: string,
  ): Promise<{ message: string; data: Role }> {
    if (!roleName) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.rolesService.getOneRoleByName(roleName);
    return {
      message: ResponseMessages.ROLE.FETCHED,
      data: role,
    };
  }
}
