import { IsNotEmpty, Max } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Max(150)
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  tagList: string[];
}
