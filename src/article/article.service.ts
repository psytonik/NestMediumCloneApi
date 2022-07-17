import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/article.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();
    Object.assign(newArticle, createArticleDto);
    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }
    newArticle.slug = ArticleService.getSlug(newArticle.title);
    newArticle.author = currentUser;
    return await this.articleRepository.save(newArticle);
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async deleteSingleArticle(slug, currentUser): Promise<DeleteResult> {
    const articleToDelete = await this.findArticleBySlug(slug);
    if (!articleToDelete) {
      throw new HttpException(
        'Requested Article not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (articleToDelete.author.id !== currentUser) {
      throw new HttpException(
        'You are not author of this Article',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.articleRepository.remove(articleToDelete);
    return { raw: 'Delete successfully' };
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private static getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
