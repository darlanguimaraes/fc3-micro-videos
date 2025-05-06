import { ListCategoriesInput } from '../../../core/category/application/use-cases/list-category/list-categories.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}
