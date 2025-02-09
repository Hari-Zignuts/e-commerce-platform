import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
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
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

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

  @Get()
  @ApiOperation({ summary: 'Get all addresses' })
  async getAllAddresses(@Req() req: ReqPayload) {
    const addresses = await this.addressesService.getAllAddresses(req);
    return {
      message: ResponseMessages.ADDRESS.FETCH_ALL_SUCCESS,
      data: addresses,
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
    const address = await this.addressesService.getOneAddressById(id);
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
    const deletedAddress = await this.addressesService.deleteOneAddressById(id);
    return {
      message: ResponseMessages.ADDRESS.DELETE_SUCCESS,
      data: deletedAddress,
    };
  }
}
