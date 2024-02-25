import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createCategoryService(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const newCategory = await this.prismaService.category.create({
        data: {
          categoryName: createCategoryDto.categoryName,
          categoryDescription: createCategoryDto.categoryDescription,
        },
      });

      return newCategory;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
