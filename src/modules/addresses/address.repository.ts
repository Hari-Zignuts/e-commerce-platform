import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDTO } from './dto/create-address-dto';
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
  async createAddress(address: CreateAddressDTO): Promise<Address | null> {
    try {
      return await this.addressRepository.save(address);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneAddressById(id: string): Promise<Address | null> {
    try {
      return await this.addressRepository.findOne({
        where: {
          id: id,
          deletedAt: IsNull(),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAddressById(address: Address): Promise<Address> {
    try {
      return await this.addressRepository.softRemove(address);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.GENERAL.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
