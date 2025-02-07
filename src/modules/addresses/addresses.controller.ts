import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDTO } from './dto/create-address-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Address } from './address.entity';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({
    status: 201,
    description: 'The address has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Get an address by ID' })
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully fetched.',
  })
  @ApiResponse({ status: 404, description: 'Address not found.' })
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
  @ApiOperation({ summary: 'Delete an address by ID' })
  @ApiResponse({
    status: 200,
    description: 'The address has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Address not found.' })
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
