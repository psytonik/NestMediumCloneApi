import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/article.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
    newArticle.author = currentUser;
    return await this.articleRepository.save(newArticle);
  }

  buildArticleResponse(createArticleDto: CreateArticleDto): any {
    return {
      article: {
        ...createArticleDto,
      },
    };
  }
}
