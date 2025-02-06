import SearchCriteria from './SearchCriteria';
import Operators from './Operators';
import Query from './Query';

export default class SearchQuery {
  public params: SearchCriteria[];
  public sort: string[];
  public page: number;
  public size: number;

  constructor() {
    this.params = [];
    this.sort = [];
    this.page = 1;
    this.size = 20;
  }

  get search(): string {
    return this.params
      .map(({ key, operator, value, isOrOpertator }) => 
         `${key}${operator}${value}${isOrOpertator ? '||' : ','}`
      )
      .join('')
      .replace(/,$/, '');
  }

  get query(): Query {
    return {
      page: this.page,
      search: this.search,
      sort: this.sort.join(','),
      size: this.size,
    };
  }

  setPage(page: number): this {
    this.page = page;
    return this;
  }

  setSize(size: number): this {
    this.size = size;
    return this;
  }

  setSearch(search: string): this {
    this.params = []; // Limpa os parâmetros antigos
    const searchMatches = `${search},`.matchAll(/(\|?)(\w+?)(:|!|>|<|~|-)(.+?)(,|\|)/gm);
    Array.from(searchMatches).forEach((match) => {
      this.with(match[2], match[3], match[4], match[1] === '|');
    });
    return this;
  }

  setSort(sort: string): this {
    this.sort = []; // Limpa os parâmetros de ordenação
    const sortMatches = `${sort},`.matchAll(/(\w+?)(:)(.+?),/gm);
    Array.from(sortMatches).forEach((match) => {
      this.sortBy(match[1], match[3]);
    });
    return this;
  }

  sortBy(key: string, sort: string): this {
    this.sort.push(`${key}:${sort}`);
    return this;
  }

  ascBy(key: string): this {
    return this.sortBy(key, 'ASC');
  }

  descBy(key: string): this {
    return this.sortBy(key, 'DESC');
  }

  with(key: string, operator: Operators, value: string, isOrOpertator: boolean = false): SearchQuery {
    this.params.push({ key, operator, value, isOrOpertator });
    return this;
  }

  or(key: string, operator: Operators, value: string): SearchQuery {
    return this.with(key, operator, value, true);
  }

  orEquals(key: string, value: string): SearchQuery {
    return this.with(key, ':', value, true);
  }

  notEquals(key: string, value: string): SearchQuery {
    return this.with(key, '!', value);
  }

  equals(key: string, value: string): SearchQuery {
    return this.with(key, ':', value);
  }

  isNull(key: string): SearchQuery {
    return this.equals(key, 'NULL');
  }

  isNotNull(key: string): SearchQuery {
    return this.notEquals(key, 'NULL');
  }

  in(key: string, values: string[]): SearchQuery {
    return this.with(key, '-', values.join(';'));
  }

  greaterThan(key: string, value: string): SearchQuery {
    return this.with(key, '>', value);
  }

  lessThan(key: string, value: string): SearchQuery {
    return this.with(key, '<', value);
  }

  from({ page, search, sort, size }: Partial<Query>): SearchQuery {
    if (search) {
      this.setSearch(search);
    }
    if (sort) {
      this.setSort(sort);
    }
    this.setPage(page || 1);
    this.setSize(size || 20);
    return this;
  }

  static build(): SearchQuery {
    return new SearchQuery();
  }

  static from(query: Partial<Query>): SearchQuery {
    return SearchQuery.build().from(query);
  }
}
