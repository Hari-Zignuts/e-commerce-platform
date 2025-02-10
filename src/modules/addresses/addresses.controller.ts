import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDTO } from './dto/create-address-dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { Address } from './address.entity';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /**
   * @version 1.0.0
   * @route POST /addresses
   * @function createAddress
   * @description Create a new address
   */
  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  async createAddress(
    @Body() createAddressDTO: CreateAddressDTO,
    @Req() req: ReqPayload,
  ): Promise<{ message: string; data: Address }> {
    const newAddress = await this.addressesService.createAddress(
      createAddressDTO,
      req,
    );
    return {
      message: ResponseMessages.ADDRESS.CREATE_SUCCESS,
      data: newAddress,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /addresses
   * @function getAllAddresses
   * @description Get all addresses from the database and filter the addresses to get only the addresses of the logged in user
   */
  @Get()
  @ApiOperation({ summary: 'Get all addresses of the logged in user' })
  async getAllAddresses(@Req() req: ReqPayload) {
    // Get all addresses from the database
    const addresses = await this.addressesService.getAllAddresses();
    // Filter the addresses to get only the addresses of the logged in user
    const userAddresses = addresses.filter((address) => {
      return address.user.id === req.user.id;
    });
    // Check if the user has any addresses
    if (userAddresses.length === 0) {
      throw new HttpException(
        ResponseMessages.ADDRESS.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // Return the response
    return {
      message: ResponseMessages.ADDRESS.FETCH_ALL_SUCCESS,
      data: userAddresses,
    };
  }

  /**
   * @version 1.0.0
   * @route GET /addresses/{id}
   * @function getOneAddressById
   * @description Get an address by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an address by ID' })
  async getOneAddressById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Address }> {
    const address = await this.addressesService.getOneAddressById(id);
    return {
      message: ResponseMessages.ADDRESS.FETCHED,
      data: address,
    };
  }

  /**
   * @version 1.0.0
   * @route PUT /addresses/{id}
   * @function updateAddress
   * @description Update an address by ID
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an address by ID' })
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDTO: CreateAddressDTO,
  ): Promise<{ message: string; data: Address }> {
    const updatedAddress = await this.addressesService.updateAddressById(
      id,
      updateAddressDTO,
    );
    return {
      message: ResponseMessages.ADDRESS.UPDATE_SUCCESS,
      data: updatedAddress,
    };
  }

  /**
   * @version 1.0.0
   * @route DELETE /addresses/{id}
   * @function deleteOneAddressById
   * @description Delete an address by ID
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address by ID' })
  async deleteOneAddressById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Address }> {
    const deletedAddress = await this.addressesService.deleteOneAddressById(id);
    return {
      message: ResponseMessages.ADDRESS.DELETE_SUCCESS,
      data: deletedAddress,
    };
  }
}
