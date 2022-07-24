import { ArticleEntity } from '../article.entity';
import { ArticleType } from './article.type';

export interface ArticleResponseInterface {
  article: ArticleEntity;
}

export interface AllArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}

export interface Comment {
  body: string;
}
export interface CommentsResponseInterface {
  comments: Comment[];
}
