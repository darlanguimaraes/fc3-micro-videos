import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model.mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  test('should thorws an error when category is invalid', () => {
    const model = CategoryModel.build({
      categoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail('The category is invalid, but it needs thorws a EntityValidationError');
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect((error as EntityValidationError).error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ],
      });
    }
  });

  test('should convert a category model to a category entity', () => {
    const createdAt = new Date();
    const model = CategoryModel.build({
      categoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt,
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category({
        categoryId: new Uuid('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        name: 'Movie',
        description: 'some description',
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  test('should convert a category entity to a category model', () => {
    const createdAt = new Date();
    const entity = new Category({
      categoryId: new Uuid('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual({
      categoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'Movie',
      description: 'some description',
      isActive: true,
      createdAt,
    });
  });
});
