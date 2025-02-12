import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import {
  mockAddress,
  mockReqPayload,
  mockUser,
} from 'src/common/mock/entity-mock';
import { mockCreateAddressDTO } from 'src/common/mock/dto-mock';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Address } from './address.entity';

describe('AddressesController', () => {
  let addressesController: AddressesController;
  let mockAddressesService: jest.Mocked<Partial<AddressesService>>;

  beforeEach(async () => {
    mockAddressesService = {
      createAddress: jest.fn(),
      getAllAddresses: jest.fn(),
      getOneAddressById: jest.fn(),
      updateAddressById: jest.fn(),
      deleteOneAddressById: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService,
        },
      ],
    }).compile();

    addressesController =
      moduleRef.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(addressesController).toBeDefined();
  });

  it('should create an address', async () => {
    (mockAddressesService.createAddress as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const response = await addressesController.createAddress(
      mockCreateAddressDTO,
      mockReqPayload,
    );

    expect(mockAddressesService.createAddress).toHaveBeenCalledWith(
      mockCreateAddressDTO,
      mockReqPayload,
    );
    expect(response).toEqual({
      message: ResponseMessages.ADDRESS.CREATE_SUCCESS,
      data: mockAddress,
    });
  });

  it('should get all addresses', async () => {
    const mockAddresses: Address[] = [
      {
        ...mockAddress,
        user: mockUser,
      },
      {
        ...mockAddress,
        id: 'address-uuid-example-2',
        street: 'street example 2',
        user: {
          ...mockUser,
          id: 'user-uuid-example-2',
          username: 'testuser2',
        },
      },
    ];
    (mockAddressesService.getAllAddresses as jest.Mock).mockResolvedValue(
      mockAddresses,
    );

    const response = await addressesController.getAllAddresses(mockReqPayload);

    expect(mockAddressesService.getAllAddresses).toHaveBeenCalled();
    const exprectedAddresses = mockAddresses.filter(
      (address) => address.user.id === mockReqPayload.user.id,
    );
    expect(response).toEqual({
      message: ResponseMessages.ADDRESS.FETCH_ALL_SUCCESS,
      data: exprectedAddresses,
    });
  });

  it('should get one address by ID', async () => {
    (mockAddressesService.getOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const response = await addressesController.getOneAddressById(
      mockAddress.id,
    );

    expect(mockAddressesService.getOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(response).toEqual({
      message: ResponseMessages.ADDRESS.FETCHED,
      data: mockAddress,
    });
  });

  it('should update an address by ID', async () => {
    (mockAddressesService.updateAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const response = await addressesController.updateAddress(
      mockAddress.id,
      mockCreateAddressDTO,
    );

    expect(mockAddressesService.updateAddressById).toHaveBeenCalledWith(
      mockAddress.id,
      mockCreateAddressDTO,
    );
    expect(response).toEqual({
      message: ResponseMessages.ADDRESS.UPDATE_SUCCESS,
      data: mockAddress,
    });
  });

  it('should delete an address by ID', async () => {
    (mockAddressesService.deleteOneAddressById as jest.Mock).mockResolvedValue(
      mockAddress,
    );

    const response = await addressesController.deleteOneAddressById(
      mockAddress.id,
    );

    expect(mockAddressesService.deleteOneAddressById).toHaveBeenCalledWith(
      mockAddress.id,
    );
    expect(response).toEqual({
      message: ResponseMessages.ADDRESS.DELETE_SUCCESS,
      data: mockAddress,
    });
  });
});
