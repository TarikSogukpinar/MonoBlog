import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty({ message: 'Category name required' })
  categoryName: string;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty({ message: 'Category description required' })
  categoryDescription: string;
}
