import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDTO } from './dto/create-address-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { AddressRepository } from './address.repository';
import { Address } from './address.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class AddressesService {
  constructor(private addressRepository: AddressRepository) {}

  async createAddress(address: CreateAddressDTO): Promise<Address> {
    const newAddress = await this.addressRepository.createAddress(address);
    if (!newAddress) {
      throw new HttpException(
        ResponseMessages.ADDRESS.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newAddress;
  }

  async getOneAddressById(id: string): Promise<Address> {
    if (!isUUID(id)) {
      throw new HttpException(
        ResponseMessages.ADDRESS.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const address = await this.addressRepository.findOneAddressById(id);
    if (!address) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return address;
  }

  async deleteOneAddressById(id: string): Promise<Address> {
    const address = await this.addressRepository.findOneAddressById(id);
    if (!address) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const deletedAddress =
      await this.addressRepository.deleteAddressById(address);
    if (!deletedAddress) {
      throw new HttpException(
        ResponseMessages.ADDRESS.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedAddress;
  }
}
