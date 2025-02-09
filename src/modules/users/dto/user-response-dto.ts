import { Exclude, Expose } from 'class-transformer';

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
  role: string;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt?: Date;
}
