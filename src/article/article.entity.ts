import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentsEntity } from './comments.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column('simple-array')
  tagList: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }

  @Column({ default: 0 })
  favoritesCount: number;

  @OneToMany((type) => CommentsEntity, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: CommentsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;
}
