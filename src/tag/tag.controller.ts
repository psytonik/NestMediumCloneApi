import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAllTags(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAllTags();
    return {
      tags: tags.map((tag) => tag.tagName),
    };
  }
}
