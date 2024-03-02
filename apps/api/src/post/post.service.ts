import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPostService(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    try {
      const newPost = await this.prismaService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          published: createPostDto.published,
          authorId: userId,
          categories: {
            connect: { id: createPostDto.categoryId },
          },
        },
      });

      return newPost;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the post',
      );
    }
  }

  async deletePostService(postId: string, userId: string): Promise<Post> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this post',
        );
      }

      // Postu sil
      return await this.prismaService.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the post',
      );
    }
  }
}
