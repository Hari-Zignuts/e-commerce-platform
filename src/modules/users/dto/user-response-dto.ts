import { Expose, Type } from 'class-transformer';

export class RoleDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;
}

export class UserResponseDTO {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;

  @Expose()
  @Type(() => RoleDTO) // Specifies the type for nested transformation
  role: RoleDTO;
}
