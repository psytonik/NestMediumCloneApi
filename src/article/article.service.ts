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
  CommentsResponseInterface,
} from './types/articleResponse.interface';
import { FollowEntity } from '../profile/follow.entity';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
  ) {}

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async findComments(slug): Promise<CommentsResponseInterface> {
    const article = await this.articleRepository.findOne({ slug });
    return { comments: article.comments };
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

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        { username: query.favorited },
        { relations: ['favorites'] },
      );
      const ids = author.favorites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentId) {
      const currentUser = await this.userRepository.findOne(currentId, {
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorite = favoriteIds.includes(article.id);
      return { ...article, favorite };
    });
    return { articles: articlesWithFavorites, articlesCount };
  }

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

  async updateArticle(
    currentUser: number,
    slug: string,
    articleDto: ArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findAndCheck(slug, currentUser);
    Object.assign(article, articleDto);
    return await this.articleRepository.save(article);
  }

  async deleteSingleArticle(
    slug: string,
    currentUser: number,
  ): Promise<DeleteResult> {
    const articleToDelete = await this.findAndCheck(slug, currentUser);
    await this.articleRepository.remove(articleToDelete);
    return { raw: [], affected: 200 };
  }

  async addArticleToFavoriteService(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
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

  async deleteArticleFromFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );
    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async getFeed(currentUserId, query): Promise<AllArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      followerId: currentUserId,
    });
    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
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
