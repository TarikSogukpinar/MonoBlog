import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('createPost')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 200, description: 'Post created successfully' })
  @ApiBody({ type: CreatePostDto })
  async createPost(@Body() createPostDto: CreatePostDto) {
    const result = await this.postService.createPostService(createPostDto);
    return {
      message: 'Post created successfully!',
      result,
    };
  }
}
