import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { RolesGuard } from 'src/common/guards/role.guard';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * @version 1.0.0
   * @route POST /roles/:name
   * @function createRole
   * @description Create a new role
   */
  @Post(':name')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new role (admin only)' })
  async createRole(
    @Param('name') name: string,
  ): Promise<{ message: string; data: Role }> {
    if (!name) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newRole = await this.rolesService.createRole(name);
    return {
      message: ResponseMessages.ROLE.CREATED,
      data: newRole,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /roles
   * @function getAllRoles
   * @description Get all roles
   */
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 404, description: 'No roles found.' })
  async getAllRoles(): Promise<{ message: string; data: Role[] }> {
    const roles = await this.rolesService.getAllRoles();
    return {
      message: ResponseMessages.ROLE.FETCHED,
      data: roles,
    };
  }

  /**
   * @version 1.0.0
   * @routes GET /roles/name/:name
   * @function getOneRoleById
   * @description Get a role by ID
   */
  @Get('/name/:name')
  @ApiOperation({ summary: 'Get a role by name' })
  @ApiResponse({ status: 400, description: 'Invalid role name.' })
  async getOneRoleByName(
    @Param('name') name: string,
  ): Promise<{ message: string; data: Role }> {
    if (!name) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.rolesService.getOneRoleByName(name);
    return {
      message: ResponseMessages.ROLE.FETCHED,
      data: role,
    };
  }

  /**
   * @version 1.0.0
   * @routes GET /roles/id/:id
   * @function getOneRoleById
   * @description Get a role by ID
   */
  @Get('/id/:id')
  @ApiOperation({ summary: 'Get a role by ID' })
  async getOneRoleById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Role }> {
    if (!id) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.rolesService.getOneRoleById(id);
    return {
      message: ResponseMessages.ROLE.FETCHED,
      data: role,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /roles/:id
   * @function updateRole
   * @description Update a role by ID
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a role by ID (admin only)' })
  async updateRole(
    @Param('id') id: string,
    @Query('name') name: string,
  ): Promise<{ message: string; data: Role }> {
    const role = await this.rolesService.updateRole(id, name);
    return {
      message: ResponseMessages.ROLE.UPDATE_SUCCESS,
      data: role,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /roles/:id
   * @function deleteRole
   * @description Delete a role by ID
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a role by ID (admin only)' })
  async deleteRole(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Role }> {
    const role = await this.rolesService.deleteRole(id);
    return {
      message: ResponseMessages.ROLE.DELETED_SUCCESS,
      data: role,
    };
  }
}
