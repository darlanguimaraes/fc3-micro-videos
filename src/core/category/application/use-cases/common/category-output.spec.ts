import { Category } from '../../../domain/category.entity';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutputMapper Unit Tests', () => {
  test('should convert a category in output', () => {
    const entity = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('Some description')
      .build();
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      isActive: true,
      createdAt: entity.createdAt,
    });
  });
});
