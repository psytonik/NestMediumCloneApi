import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/article.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserDecorator } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async allArticles() {
    return ['articles'];
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articleById = await this.articleService.findArticleBySlug(slug);
    return this.articleService.buildArticleResponse(articleById);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @UserDecorator('id') currentUser: number,
    @Param('slug') slug: string,
  ): Promise<any> {
    return await this.articleService.deleteSingleArticle(slug, currentUser);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @UserDecorator() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
