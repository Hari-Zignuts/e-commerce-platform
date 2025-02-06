import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(roleName: string): Promise<Role> {
    const newRole = await this.roleRepository.createRole(roleName);
    if (!newRole) {
      throw new HttpException(
        ResponseMessages.ROLE.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newRole;
  }

  async getOneRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleRepository.findOneRoleByName(roleName);
    if (!role) {
      throw new HttpException(
        ResponseMessages.ROLE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return role;
  }
}
