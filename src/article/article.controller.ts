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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserDecorator } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import {
  ArticleResponseInterface,
  AllArticlesResponseInterface,
  CommentsResponseInterface,
} from './types/articleResponse.interface';
import { BackEndValidationPipe } from '../shared/pipes/backEndValidation.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAllArticles(
    @UserDecorator('id') currentId: number,
    @Query() query: any,
  ): Promise<AllArticlesResponseInterface> {
    return await this.articleService.getAllArticles(currentId, query);
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsResponseInterface> {
    return this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.' })
  @ApiResponse({ status: 401, description: 'Not Authorized.' })
  @Get('feed')
  @UseGuards(AuthGuard)
  async feedArticles(
    @UserDecorator('id') currentUserId: number,
    @Query() query: any,
  ): Promise<AllArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articleById = await this.articleService.findArticleBySlug(slug);
    return this.articleService.buildArticleResponse(articleById);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Not Authorized..' })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackEndValidationPipe())
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

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Not Authorized.' })
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackEndValidationPipe())
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

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Not Authorized.' })
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @UserDecorator('id') currentUser: number,
    @Param('slug') slug: string,
  ): Promise<any> {
    return await this.articleService.deleteSingleArticle(slug, currentUser);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully favorited.',
  })
  @ApiResponse({ status: 401, description: 'Not Authorized.' })
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

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully unfavorited.',
  })
  @ApiResponse({ status: 401, description: 'Not Authorized.' })
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @UserDecorator('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
