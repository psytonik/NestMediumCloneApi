import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createArticle(data) {
    console.log(data);
    return 'hello world';
  }
}
