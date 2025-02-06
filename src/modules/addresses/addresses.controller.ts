import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDTO } from './dto/create-address-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Address } from './address.entity';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post()
  async createAddress(
    @Body() createAddressDTO: CreateAddressDTO,
  ): Promise<{ message: string; data: Address }> {
    const newAddress =
      await this.addressService.createAddress(createAddressDTO);
    return {
      message: ResponseMessages.ADDRESS.CREATED,
      data: newAddress,
    };
  }

  @Get(':id')
  async getOneAddressById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Address }> {
    const address = await this.addressService.getOneAddressById(id);
    return {
      message: ResponseMessages.ADDRESS.FETCHED,
      data: address,
    };
  }

  @Delete(':id')
  async deleteOneAddressById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Address }> {
    const deletedAddress = await this.addressService.deleteOneAddressById(id);
    return {
      message: ResponseMessages.ADDRESS.DELETE_SUCCESS,
      data: deletedAddress,
    };
  }
}
