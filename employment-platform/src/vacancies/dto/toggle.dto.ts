import { ApiProperty } from '@nestjs/swagger';

export class ToggleActiveDto {
  @ApiProperty({ example: true, description: 'Define si la vacante está activa o no' })
  active: boolean;
}
