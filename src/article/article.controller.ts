import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserDecorator } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import {
  ArticleResponseInterface,
  AllArticlesResponseInterface,
} from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAllArticles(
    @UserDecorator('id') currentId: number,
    @Query() query: any,
  ): Promise<AllArticlesResponseInterface> {
    return await this.articleService.getAllArticles(currentId, query);
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
  @UsePipes(new ValidationPipe())
  async createArticle(
    @UserDecorator() currentUser: UserEntity,
    @Body('article') createArticleDto: ArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @UserDecorator('id') currentUser: number,
    @Body('article') articleDto: ArticleDto,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      currentUser,
      slug,
      articleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @UserDecorator('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavoriteService(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
