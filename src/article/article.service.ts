import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticleService {
  async createArticle(data): Promise<ArticleEntity> {
    return this.buildArticleResponse(data);
  }

  buildArticleResponse(articleEntity: ArticleEntity): any {
    return {
      article: {
        ...articleEntity,
      },
    };
  }
}
