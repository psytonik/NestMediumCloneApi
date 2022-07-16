import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { AuthGuard } from '../user/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  async createArticle(@Body() data: CreateArticleDto): Promise<ArticleEntity> {
    return this.articleService.createArticle(data);
  }
}
