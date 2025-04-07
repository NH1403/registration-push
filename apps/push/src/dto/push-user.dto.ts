import { IsNumber, IsString } from 'class-validator';

export class PushUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;
}
