import { ArticleEntity } from '../article.entity';

export interface ArticleResponseInterface {
  article: ArticleEntity;
}
export interface AllArticlesResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}
