import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(roleName: string): Promise<Role | null> {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (existingRole) {
        throw new HttpException(
          ResponseMessages.ROLE.ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const role = new Role();
      role.name = roleName;
      return await this.roleRepository.save(role);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneRoleByName(roleName: string): Promise<Role | null> {
    try {
      return await this.roleRepository.findOne({
        where: { name: roleName },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
