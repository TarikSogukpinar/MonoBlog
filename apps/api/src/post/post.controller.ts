import { Controller, Post, Delete, Body, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @Post('createPost')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 200, description: 'Post created successfully' })
  @ApiBody({ type: CreatePostDto })
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    const userId = req.user.id;

    const result = await this.postService.createPostService(
      userId,
      createPostDto,
    );
    return {
      message: 'Post created successfully!',
      result,
    };
  }

  @Delete('deletePost')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deletePost(@Req() req, @Body('postId') postId: string) {
    const userId = req.user.id;

    const result = await this.postService.deletePostService(postId, userId);
    return {
      message: 'Post deleted successfully!',
      result,
    };
  }
}
