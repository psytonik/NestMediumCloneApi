import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1658008049540 implements MigrationInterface {
  name = 'SeedDb1658008049540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags ("tagName") VALUES ('dragons'), ('coffee'), ('nestjs'), ('nextjs')`,
    );
    /// password: QAZxsw!@#456
    await queryRunner.query(
      `INSERT INTO users (username,email,password) VALUES ('psytonik', 'psytonik@icloud.com', '$2b$10$Zdy4ZrlgS5jnkjbBsF/lg.I3YIEiUUwNdkzQ02gHZxpaQPcmJkI0i')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug,title,description,body, "tagList", "authorId") VALUES ('first-article', 'first article', 'description in the cription', 'this is fucken body', 'coffee,dragons,nestjs,text,hello,', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug,title,description,body, "tagList", "authorId") VALUES ('second-article', 'second first article', 'second description in the cription', 'second body this is fucken body', 'coffee,dragons,nestjs,text,hello,saar,go,home', 1)`,
    );
  }

  down(queryRunner: QueryRunner): Promise<any> {
    return Promise.resolve(undefined);
  }
}
