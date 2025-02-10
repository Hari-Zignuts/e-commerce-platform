import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDTO {
  @ApiPropertyOptional({
    description: 'The status of the order',
    example: 'delivered',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'completed', 'cancelled'], {
    message: 'The status must be either pending, completed, or cancelled',
  })
  status: string;
}
