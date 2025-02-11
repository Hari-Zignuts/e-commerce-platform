import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

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

  it('should create a new address', async () => {
  });
});
