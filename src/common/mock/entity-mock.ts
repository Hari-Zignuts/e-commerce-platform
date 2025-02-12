import { Address } from 'src/modules/addresses/address.entity';
import { Role } from 'src/modules/roles/role.entity';
import { User } from 'src/modules/users/user.entity';
import { ReqPayload } from '../interfaces/req-payload.interface';

export const mockReqPayload: ReqPayload = {
  user: {
    id: 'user-uuid-example',
    username: 'testuser',
    email: 'test@gamil.com',
    role: 'user',
  },
} as ReqPayload;

export const roleMock: Role = {
  id: 'role-uuid-example',
  name: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [],
};

export const mockUser: User = {
  id: 'user-uuid-example',
  username: 'testuser',
  firstName: 'test',
  lastName: 'user',
  password: 'hash-password',
  email: 'test@gmail.com',
  role: roleMock,
  createdAt: new Date(),
  updatedAt: new Date(),
  addresses: [],
  orders: [],
  likes: [],
};

export const mockAddress: Address = {
  id: 'address-uuid-example',
  street: 'street example',
  city: 'city example',
  state: 'state example',
  zip: 'zip example',
  country: 'country example',
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
  order: [],
};
