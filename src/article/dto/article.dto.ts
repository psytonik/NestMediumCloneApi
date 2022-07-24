import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({ example: 'This is an example of title' })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: 'This is an example of description' })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: 'This is an example of body' })
  @IsNotEmpty()
  readonly body: string;

  @ApiProperty({ example: ['example', 'nextjs', 'nestjs', 'swagger'] })
  readonly tagList?: string[];
}
