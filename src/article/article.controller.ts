import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async allArticles() {
    return ['articles'];
  }

  @Get('/:slug')
  async getArticleById() {
    return 'string';
  }

  @Post()
  async createArticle(@Body() data: CreateArticleDto) {
    return this.articleService.createArticle(data);
  }
}
