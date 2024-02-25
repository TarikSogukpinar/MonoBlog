import { Controller, Post, Body } from '@nestjs/common';
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
}
