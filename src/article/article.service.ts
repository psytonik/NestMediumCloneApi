import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/article.dto';
import { Repository } from 'typeorm';
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
