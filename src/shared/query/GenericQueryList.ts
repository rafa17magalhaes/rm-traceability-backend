/* eslint-disable @typescript-eslint/no-unsafe-argument */
import PaginationDTO from '../dtos/PaginationDTO';
import IListRepository from './IListRepository';
import SearchQuery from './SearchQuery';

export type QueryParams = {
  page?: string;
  search?: string;
  sort?: string;
  size?: string;
  filters?: Record<string, any>;
};

export default class GenericQueryList<T> {
  constructor(
    private repository: IListRepository<T>,
    private query: SearchQuery = SearchQuery.build(),
  ) {}

  public list({
    page,
    search,
    sort,
    filters,
  }: QueryParams): Promise<PaginationDTO<T>> {
    const searchQuery = this.query
      .setPage(page ? Number(page) : 1)
      .setSearch(search || '')
      .setSort(sort || '')
      .setSize(999999);

    if (filters) {
      Object.keys(filters).forEach((key) => {
        searchQuery.equals(key, filters[key]);
      });
    }

    return this.repository.findAll(searchQuery);
  }
}
