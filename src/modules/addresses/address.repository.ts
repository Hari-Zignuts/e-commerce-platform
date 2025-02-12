import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Address } from './address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  /**
   * @version 1.0.0
   * @function saveAddress
   * @description Save or Update an address in the database
   */
  async saveAddress(address: Address): Promise<Address | null> {
    try {
      return await this.addressRepository.save(address);
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
   * @function findAllAddresses
   * @description Find all addresses
   */
  async findAllAddresses(): Promise<Address[]> {
    try {
      return await this.addressRepository.find({
        where: {
          deletedAt: IsNull(),
        },
        relations: ['user'],
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
   * @function findOneAddressById
   * @description Find an address by ID and return the address object
   */
  async findOneAddressById(id: string): Promise<Address | null> {
    try {
      return await this.addressRepository.findOne({
        where: {
          id: id,
          deletedAt: IsNull(),
        },
        relations: ['user'],
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
   * @function deleteAddress
   * @description Delete an address
   */
  async deleteAddress(address: Address): Promise<Address> {
    try {
      return await this.addressRepository.remove(address);
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
