import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  await app.enableCors();
  await app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJs Application')
    .setDescription('Small application like a FaceBook')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [UserModule, ProfileModule, ArticleModule, TagModule],
  });
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}
bootstrap().then();
