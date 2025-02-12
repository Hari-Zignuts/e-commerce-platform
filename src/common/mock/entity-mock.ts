import { Address } from 'src/modules/addresses/address.entity';
import { Role } from 'src/modules/roles/role.entity';
import { User } from 'src/modules/users/user.entity';
import { ReqPayload } from '../interfaces/req-payload.interface';
import { mockCreateAddressDTO } from './dto-mock';
import { v4 as uuidv4 } from 'uuid';

const roleUser = new Role();
roleUser.id = uuidv4();
roleUser.name = 'user';

const roleAdmin = new Role();
roleAdmin.id = uuidv4();
roleAdmin.name = 'admin';

const user = new User();
user.id = uuidv4();
user.username = 'testuser';
user.firstName = 'test';
user.lastName = 'user';
user.password = 'hash-password';
user.email = 'test@gmail.com';
user.role = roleUser;

const admin = new User();
admin.id = uuidv4();
admin.username = 'testadmin';
admin.firstName = 'test';
admin.lastName = 'admin';
admin.password = 'hash-password';
admin.email = 'admin@gmail.com';
admin.role = roleAdmin;

const address = new Address();
address.id = uuidv4();
address.street = mockCreateAddressDTO.street;
address.city = mockCreateAddressDTO.city;
address.state = mockCreateAddressDTO.state;
address.zip = mockCreateAddressDTO.zip;
address.country = mockCreateAddressDTO.country;

export const mockRoleUser = roleUser;
export const mockRoleAdmin = roleAdmin;
export const mockUser = user;
export const mockAdmin = admin;
export const mockAddress = address;
export const mockReqPayloadUser: ReqPayload = {
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    role: roleUser.name,
  },
} as ReqPayload;
export const mockReqPayloadAdmin: ReqPayload = {
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    role: roleAdmin.name,
  },
} as ReqPayload;
