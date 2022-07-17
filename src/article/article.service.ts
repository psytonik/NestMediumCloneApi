import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { ArticleDto } from './dto/article.dto';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import {
  AllArticlesResponseInterface,
  ArticleResponseInterface,
} from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: ArticleDto,
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

  async deleteSingleArticle(
    slug: string,
    currentUser: number,
  ): Promise<DeleteResult> {
    const articleToDelete = await this.findAndCheck(slug, currentUser);
    await this.articleRepository.remove(articleToDelete);
    return { raw: [], affected: 200 };
  }

  async getAllArticles(
    currentId: number,
    query: any,
  ): Promise<AllArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async updateArticle(
    currentUser: number,
    slug: string,
    articleDto: ArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findAndCheck(slug, currentUser);
    Object.assign(article, articleDto);
    return await this.articleRepository.save(article);
  }

  async addArticleToFavoriteService(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findAndCheck(slug, currentUserId);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const isNotFavorite =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;
    if (isNotFavorite) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private async findAndCheck(
    slug: string,
    currentUser: number,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    if (!article) {
      throw new HttpException(
        'Requested Article not Found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (article.author.id !== currentUser) {
      throw new HttpException(
        'You are not author of this Article',
        HttpStatus.FORBIDDEN,
      );
    }
    return article;
  }

  private static getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
