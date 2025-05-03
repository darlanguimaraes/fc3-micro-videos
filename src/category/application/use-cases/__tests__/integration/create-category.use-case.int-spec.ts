import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use-case"

describe('CreateCatgegoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  test('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.id,
      name: entity.name,
      description: null,
      isActive: true,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'test',
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      isActive: true,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      isActive: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      isActive: false,
      createdAt: entity.createdAt,
    });
  });
});