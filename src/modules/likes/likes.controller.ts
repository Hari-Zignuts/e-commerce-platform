import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ReqPayload } from 'src/common/interfaces/req-payload.interface';

@ApiTags('likes')
@Controller('likes')
@ApiBearerAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a like' })
  @ApiQuery({ name: 'productId', required: true })
  async createLike(
    @Query('productId') productId: string,
    @Req() req: ReqPayload,
  ) {
    return await this.likesService.createLike(req, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all likes' })
  async getAllLikes(@Req() req: ReqPayload) {
    return await this.likesService.getAllLikes(req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a like by ID' })
  @ApiParam({ name: 'id', required: true })
  async getOneLikeById(@Param('id') id: string) {
    return await this.likesService.getOneLikeById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a like' })
  @ApiParam({ name: 'id', required: true })
  async deleteLike(@Param('id') id: string) {
    return await this.likesService.deleteLike(id);
  }
}
