import { Test, TestingModule } from '@nestjs/testing';
import { IRepository } from '../../../core/shared/domain/repository/repository-interface';
import { CategoriesController } from '../categories.controller';
import { ConfigModule } from '../../config-module/config.module';
import { DatabaseModule } from '../../database-module/database.module';
import { CategoriesModule } from '../categories.module';
import { CATEGORY_PROVIDERS } from '../categories-providers';
import { CreateCategoryUseCase } from '../../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../../core/category/application/use-cases/update-category/update-category.use-case';
import { ListCategoriesUseCase } from '../../../core/category/application/use-cases/list-category/list-categories.use-case';
import { GetCategoryUseCase } from '../../../core/category/application/use-cases/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '../../../core/category/application/use-cases/delete-category/delete-category.use-case';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: IRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<IRepository<any, any>>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
  });
});
