import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/article.dto';
import { ArticleEntity } from './article.entity';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserDecorator } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';

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
  async createArticle(
    @UserDecorator() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<any> {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }
}
