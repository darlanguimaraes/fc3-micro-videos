import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.id);
    const entity = await this.categoryRepository.findById(uuid);
    if (!entity) {
      throw new NotFoundError(input.id, Category);
    }
    return CategoryOutputMapper.toOutput(entity);
  }
}

export type GetCategoryInput = {
  id: string;
}

export type GetCategoryOutput = CategoryOutput;