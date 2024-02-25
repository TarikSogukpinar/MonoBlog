import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  //author id filled from token user id
  async createPostService(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = await this.prismaService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          published: createPostDto.published,
          authorId: createPostDto.authorId,
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
}
