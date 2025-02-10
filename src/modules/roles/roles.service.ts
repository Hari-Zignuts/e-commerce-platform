import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Role } from './role.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * @version 1.0.0
   * @function createRole
   * @description Create a new role in the database
   */
  async createRole(name: string): Promise<Role> {
    // Create a new role object
    const role = new Role();
    role.name = name;
    // Save the role object to the database
    const newRole = await this.roleRepository.saveRole(role);
    if (!newRole) {
      throw new HttpException(
        ResponseMessages.ROLE.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Return the newly created role object
    return newRole;
  }

  /**
   * @version 1.0.0
   * @function getOneRoleById
   * @description Get a role by ID
   */
  async getOneRoleById(id: string): Promise<Role> {
    // Check if the ID is a valid UUID
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.ROLE.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Find the role by ID
    const role = await this.roleRepository.findOneRoleById(id);
    if (!role) {
      throw new HttpException(
        ResponseMessages.ROLE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the role object
    return role;
  }

  /**
   * @version 1.0.0
   * @function getOneRoleByName
   * @description Get a role by name
   */
  async getOneRoleByName(name: string): Promise<Role> {
    // Find the role by name
    const role = await this.roleRepository.findOneRoleByName(name);
    // Check if the role exists
    if (!role) {
      throw new HttpException(
        ResponseMessages.ROLE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the role object
    return role;
  }

  /**
   * @version 1.0.0
   * @function getAllRoles
   * @description Get all roles from the database
   */
  async getAllRoles(): Promise<Role[]> {
    // Find all roles
    const roles = await this.roleRepository.findAllRoles();
    // Check if any roles were found
    if (!roles) {
      throw new HttpException(
        ResponseMessages.ROLE.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the array of role objects
    return roles;
  }

  /**
   * @version 1.0.0
   * @function updateRole
   * @description Update a role in the database
   */
  async updateRole(id: string, name: string): Promise<Role> {
    // Check if the name is provided
    if (!name) {
      throw new HttpException(
        ResponseMessages.GENERAL.INVALID_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Find the role by ID
    const role = await this.getOneRoleById(id);
    // Update the role name
    role.name = name;
    // Save the updated role object
    const updatedRole = await this.roleRepository.saveRole(role);
    if (!updatedRole) {
      throw new HttpException(
        ResponseMessages.ROLE.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Return the updated role object
    return updatedRole;
  }

  /**
   * @version 1.0.0
   * @function deleteRole
   * @description Delete a role from the database
   */
  async deleteRole(id: string): Promise<Role> {
    // Find the role by ID
    const role = await this.getOneRoleById(id);
    // Delete the role
    const deletedRole = await this.roleRepository.deleteRole(role);
    if (!deletedRole) {
      throw new HttpException(
        ResponseMessages.ROLE.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Return the deleted role object
    return deletedRole;
  }
}
