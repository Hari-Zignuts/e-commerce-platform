import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDTO } from './dto/create-address-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { AddressRepository } from './address.repository';
import { Address } from './address.entity';
import { isUUID } from 'class-validator';
import { UsersService } from '../users/users.service';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';
import { UpdateAddressDTO } from './dto/update-address-dto';

@Injectable()
export class AddressesService {
  constructor(
    private addressRepository: AddressRepository,
    private readonly userService: UsersService,
  ) {}

  /**
   * @version 1.0.0
   * @function createAddress
   * @description Create a new address
   */
  async createAddress(
    createAddressDTO: CreateAddressDTO,
    req: ReqPayload,
  ): Promise<Address> {
    // create a new address object
    const address = new Address();
    // assign the values from the DTO to the address object
    Object.assign(address, createAddressDTO);
    // get the user object from the user service
    const user = await this.userService.getOneUserById(req.user.id);
    // assign the user object to the address object
    address.user = user;
    // save the address object to the database
    const newAddress = await this.addressRepository.saveAddress(address);
    // if the address object is not saved to the database, throw an error
    if (!newAddress) {
      throw new HttpException(
        ResponseMessages.ADDRESS.CREATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the saved address object
    return newAddress;
  }

  /**
   * @version 1.0.0
   * @function getAllAddresses
   * @description Find all addresses
   */
  async getAllAddresses(): Promise<Address[]> {
    // get all addresses from the database
    const addresses = await this.addressRepository.findAllAddresses();
    // if no addresses are found, throw an error
    if (!addresses) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // return the addresses
    return addresses;
  }

  /**
   * @version 1.0.0
   * @function getOneAddressById
   * @description Find an address by ID and return the address object
   */
  async getOneAddressById(id: string): Promise<Address> {
    // check if the ID is a valid UUID
    if (!id || !isUUID(id)) {
      throw new HttpException(
        ResponseMessages.ADDRESS.INVALID_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    // get the address from the database
    const address = await this.addressRepository.findOneAddressById(id);
    // if the address is not found, throw an error
    if (!address) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // return the address
    return address;
  }

  /**
   * @version 1.0.0
   * @function deleteAddressById
   * @description Delete an address by ID
   */
  async deleteOneAddressById(id: string): Promise<Address> {
    // get the address from the database
    const address = await this.getOneAddressById(id);
    // delete the address from the database
    const deletedAddress = await this.addressRepository.deleteAddress(address);
    // if the address is not deleted, throw an error
    if (!deletedAddress) {
      throw new HttpException(
        ResponseMessages.ADDRESS.DELETE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the deleted address
    return deletedAddress;
  }

  /**
   * @version 1.0.0
   * @function updateAddressById
   * @description Update an address by ID
   */
  async updateAddressById(
    id: string,
    updateAddressDTO: UpdateAddressDTO,
  ): Promise<Address> {
    // Check if any updates were provided
    const hasUpdates = Object.keys(updateAddressDTO).length > 0;
    if (!hasUpdates) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NO_UPDATE,
        HttpStatus.BAD_REQUEST,
      );
    }
    // get the address from the database
    const address = await this.getOneAddressById(id);
    // assign the values from the DTO to the address object
    Object.assign(address, updateAddressDTO);
    // save the address object to the database
    const updatedAddress = await this.addressRepository.saveAddress(address);
    // if the address object is not saved to the database, throw an error
    if (!updatedAddress) {
      throw new HttpException(
        ResponseMessages.ADDRESS.UPDATE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return the updated address
    return updatedAddress;
  }
}
