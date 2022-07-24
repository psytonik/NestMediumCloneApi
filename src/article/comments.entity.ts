import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;
}
