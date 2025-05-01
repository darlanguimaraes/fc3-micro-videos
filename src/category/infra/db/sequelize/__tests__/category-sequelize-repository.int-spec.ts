import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { CategoryModelMapper } from "../category-model.mapper";
import { CategorySearchParams, CategorySearchResult } from "../../../../domain/category.repository";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe('CategorySequelizeRepository Integration Test', () => {
  let repository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  test('should insert a new category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.categoryId.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  test('should find a category', async () => {

    const entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull()

    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const entity = await repository.findById(category.categoryId);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  test('should return all categories', async () => {
    const entities = Category.fake().theCategories(3).build();
    entities.forEach(async (category) => {
      await repository.insert(category);
    });

    const categories = await repository.findAll();
    expect(categories).toHaveLength(3);
  });

  test('should throw an error when try update a category not found', async () => {
    const entity = Category.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.categoryId.id, Category)
    );
  });

  test('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName('Movie');
    await repository.update(entity);

    const category = await repository.findById(entity.categoryId);
    expect(category.toJSON()).toStrictEqual(entity.toJSON());
  });

  test('should throw an error when try delete a category not found', async () => {
    const id = new Uuid();
    await expect(repository.delete(id)).rejects.toThrow(
      new NotFoundError(id.id, Category)
    );
  });

  test('should delete a category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    await repository.delete(entity.categoryId);
    await (expect(repository.findById(entity.categoryId)).resolves.toBeNull());
  });

  describe('Search method tests', () => {
    test('should only apply paginate when other params are null', async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.categoryId).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt,
        })
      );
    });

    test('should order by createdAt DESC when search params are null', async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      await repository.bulkInsert(categories);

      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.name).toBe(`Movie ${index + 1}`);
      });
    });

    test('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
      ];
      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          currentPage: 1,
          perPage: 2,
          total: 3,
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          currentPage: 2,
          perPage: 2,
          total: 3,
        }).toJSON(true)
      );
    });

    test('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt']);

      const categories = [
        Category.fake().aCategory().withName('b').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('d').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('c').build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
            sortDir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
            sortDir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ];

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];
      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );

    });
  });
});