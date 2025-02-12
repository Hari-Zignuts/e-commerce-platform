import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { AddressRepository } from './address.repository';
import { UsersService } from '../users/users.service';
import {
  mockAddress,
  mockReqPayloadUser,
  mockUser,
} from 'src/common/mock/entity-mock';
import { mockCreateAddressDTO } from 'src/common/mock/dto-mock';

describe('AddressesService', () => {
  let service: AddressesService;
  let mockAddressRepository: jest.Mocked<Partial<AddressRepository>>;
  let mockUsersService: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    mockAddressRepository = {
      saveAddress: jest.fn(),
      findAllAddresses: jest.fn(),
      findOneAddressById: jest.fn(),
      deleteAddress: jest.fn(),
    };
    mockUsersService = {
      getOneUserById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: AddressRepository,
          useValue: mockAddressRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    mockAddressRepository = module.get<AddressRepository>(AddressRepository);
    mockUsersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockAddressRepository).toBeDefined();
    expect(mockUsersService).toBeDefined();
  });

  it('should create an address', async () => {
    (mockUsersService.getOneUserById as jest.Mock).mockResolvedValue(mockUser);
    (mockAddressRepository.saveAddress as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const result = await service.createAddress(
      mockCreateAddressDTO,
      mockReqPayloadUser,
    );

    expect(mockUsersService.getOneUserById).toHaveBeenCalledWith(mockUser.id);
    expect(mockAddressRepository.saveAddress).toHaveBeenCalledWith(
      expect.objectContaining({
        street: mockCreateAddressDTO.street,
        city: mockCreateAddressDTO.city,
        state: mockCreateAddressDTO.state,
        zip: mockCreateAddressDTO.zip,
        country: mockCreateAddressDTO.country,
        user: mockUser,
      }),
    );
    expect(result).toBe(mockAddress);
  });

  it('should get all addresses', async () => {
    (mockAddressRepository.findAllAddresses as jest.Mock).mockResolvedValue([
      mockAddress,
    ]);

    const result = await service.getAllAddresses();
    expect(mockAddressRepository.findAllAddresses).toHaveBeenCalled();
    expect(result).toEqual([mockAddress]);
  });

  it('should get one address by id', async () => {
    (mockAddressRepository.findOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const result = await service.getOneAddressById(mockAddress.id);
    expect(mockAddressRepository.findOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(result).toBe(mockAddress);
  });

  it('should delete an address', async () => {
    (mockAddressRepository.findOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );
    (mockAddressRepository.deleteAddress as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const result = await service.deleteOneAddressById(mockAddress.id);
    expect(mockAddressRepository.findOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(mockAddressRepository.deleteAddress).toHaveBeenCalledWith(
      mockAddress,
    );
    expect(result).toBe(mockAddress);
  });

  it('shoud update an address', async () => {
    (mockAddressRepository.findOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );
    (mockAddressRepository.saveAddress as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const result = await service.updateAddressById(
      mockAddress.id,
      mockCreateAddressDTO,
    );

    expect(mockAddressRepository.findOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(mockAddressRepository.saveAddress).toHaveBeenCalledWith(
      expect.objectContaining({
        street: mockCreateAddressDTO.street,
        city: mockCreateAddressDTO.city,
        state: mockCreateAddressDTO.state,
        zip: mockCreateAddressDTO.zip,
        country: mockCreateAddressDTO.country,
      }),
    );
    expect(result).toBe(mockAddress);
  });

  it('should throw an error when address is not found', async () => {
    (mockAddressRepository.findOneAddressById as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(service.getOneAddressById(mockAddress.id)).rejects.toThrow();
    await expect(
      service.deleteOneAddressById(mockAddress.id),
    ).rejects.toThrow();

    expect(mockAddressRepository.findOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(mockAddressRepository.deleteAddress).not.toHaveBeenCalled();
  });

  it('should throw an error when address is not deleted', async () => {
    (mockAddressRepository.findOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );
    (mockAddressRepository.deleteAddress as jest.Mock).mockResolvedValue(null);

    await expect(
      service.deleteOneAddressById(mockAddress.id),
    ).rejects.toThrow();

    expect(mockAddressRepository.findOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(mockAddressRepository.deleteAddress).toHaveBeenCalledWith(
      mockAddress,
    );
  });
});
