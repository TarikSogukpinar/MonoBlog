import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';


@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('createPost')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 200, description: 'Post created successfully' })
  @ApiBody({ type: CreatePostDto })
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    const userId = req.user.id;

    console.log('userId', userId);

    const result = await this.postService.createPostService(
      userId,
      createPostDto,
    );
    return {
      message: 'Post created successfully!',
      result,
    };
  }
}
