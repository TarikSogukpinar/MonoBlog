import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty({ message: 'Category name required' })
  categoryName: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  categoryDescription: string;
}
