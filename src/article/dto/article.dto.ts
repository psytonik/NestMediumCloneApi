import { IsNotEmpty, Max } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Max(150)
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

  readonly tagList?: string[];
}
