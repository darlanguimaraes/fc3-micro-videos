import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Without Validator Unit Tests", () => {
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });
  test("constructor of category", () => {
    let category = new Category({ name: "Movie" });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    category = new Category({
      name: "Movie",
      description: "some description",
      isActive: false,
      createdAt,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("some description");
    expect(category.isActive).toBe(false);
    expect(category.createdAt).toBe(createdAt);

    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("other description");
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      isActive: true,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);

    createdAt = new Date();
    category = new Category({
      name: "Movie",
      createdAt,
    });
    expect(category.categoryId).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBe(createdAt);
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.isActive).toBe(true);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test("should create a category with isActive", () => {
      const category = Category.create({
        name: "Movie",
        isActive: false,
      });
      expect(category.categoryId).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.isActive).toBe(false);
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe("categoryId field", () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    test.each(arrange)("should be is %j", (props) => {
      const category = new Category(props as any);
      expect(category.categoryId).toBeInstanceOf(Uuid);
    });
  });

  test("should change name", () => {
    const category = new Category({
      name: "Movie",
    });
    category.changeName("other name");
    expect(category.name).toBe("other name");
    expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  test("should change description", () => {
    const category = new Category({
      name: "Movie",
    });
    category.changeDescription("some description");
    expect(category.description).toBe("some description");
    expect(category.notification.hasErrors()).toBe(false);
  });

  test("should active a category", () => {
    const category = new Category({
      name: "Filmes",
      isActive: false,
    });
    category.activate();
    expect(category.isActive).toBe(true);
    expect(category.notification.hasErrors()).toBe(false);
  });

  test("should disable a category", () => {
    const category = new Category({
      name: "Filmes",
      isActive: true,
    });
    category.deactivate();
    expect(category.isActive).toBe(false);
    expect(category.notification.hasErrors()).toBe(false);
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    test("should an invalid category with name property", () => {
      const category = Category.create({ name: "t".repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });

  describe("changeName method", () => {
    it("should a invalid category using name property", () => {
      const category = Category.create({ name: "Movie" });
      category.changeName("t".repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });
});