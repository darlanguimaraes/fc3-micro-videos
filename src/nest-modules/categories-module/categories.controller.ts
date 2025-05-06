import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category/delete-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/use-cases/list-category/list-categories.use-case';
import { GetCategoryUseCase } from '../../core/category/application/use-cases/get-category/get-category.use-case';
import { CreateCategoryInput } from '../../core/category/application/use-cases/create-category/create-category.input';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CategoryOutput } from '../../core/category/application/use-cases/common/category-output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryInput) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCategoriesDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id,
    });
    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
