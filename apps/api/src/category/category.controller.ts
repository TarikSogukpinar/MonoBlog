import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('createCategory')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 200, description: 'Category created successfully' })
  @ApiBody({ type: CreateCategoryDto })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const result =
      this.categoryService.createCategoryService(createCategoryDto);
    return {
      message: 'Category created successfully!',
      result,
    };
  }

  @Post('updateCategory/:categoryId')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiBody({ type: CreateCategoryDto })
  async updateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('categoryId') categoryId: string,
  ) {
    const result = this.categoryService.updateCategoryService(
      categoryId,
      createCategoryDto,
    );
    return {
      message: 'Category updated successfully!',
      result,
    };
  }

  @Delete('deleteCategory/:categoryId')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('categoryId') categoryId: string) {
    const result = this.categoryService.deleteCategoryService(categoryId);
    return {
      message: 'Category deleted successfully!',
      result,
    };
  }
}
