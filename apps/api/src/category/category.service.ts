import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategoryService(): Promise<Category[]> {
    try {
      const allCategories = await this.prismaService.category.findMany();
      return allCategories;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async createCategoryService(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ categoryName: string; categoryDescription: string }> {
    try {
      const newCategory = await this.prismaService.category.create({
        data: {
          categoryName: createCategoryDto.categoryName,
          categoryDescription: createCategoryDto.categoryDescription,
        },
      });

      return {
        categoryName: newCategory.categoryName,
        categoryDescription: newCategory.categoryDescription,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async updateCategoryService(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.prismaService.category.update({
        where: { id: categoryId },
        data: updateCategoryDto,
      });
      return updatedCategory;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async deleteCategoryService(categoryId: string): Promise<Category> {
    try {
      const deletedCategory = await this.prismaService.category.delete({
        where: { id: categoryId },
      });
      return deletedCategory;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
