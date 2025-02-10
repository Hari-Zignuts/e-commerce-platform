import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveRole
   * @description Save or Update a role in the database
   */
  async saveRole(role: Role): Promise<Role | null> {
    try {
      return await this.roleRepository.save(role);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findOneRoleById
   * @description Find a role by ID and return the role object
   */
  async findOneRoleById(id: string): Promise<Role | null> {
    try {
      return await this.roleRepository.findOne({
        where: { id: id, deletedAt: IsNull() },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findOneRoleByName
   * @description Find a role by name and return the role object
   */
  async findOneRoleByName(name: string): Promise<Role | null> {
    try {
      return await this.roleRepository.findOne({
        where: { name: name, deletedAt: IsNull() },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function findAllRoles
   * @description Find all roles and return an array of role objects
   */
  async findAllRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({
        where: { deletedAt: IsNull() },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }

  /**
   * @version 1.0.0
   * @function deleteRole
   * @description Delete a role from the database
   */
  async deleteRole(role: Role): Promise<Role | null> {
    try {
      return await this.roleRepository.remove(role);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message,
      );
    }
  }
}
