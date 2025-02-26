import SearchQuery from './SearchQuery';

describe('SearchQuery', () => {
  let query: SearchQuery;

  beforeEach(() => {
    query = SearchQuery.build();
  });

  it('should initialize with default values', () => {
    expect(query.page).toBe(1);
    expect(query.size).toBe(20);
    expect(query.params).toEqual([]);
    expect(query.sort).toEqual([]);
  });

  it('should set page correctly', () => {
    query.setPage(3);
    expect(query.page).toBe(3);
  });

  it('should set size correctly', () => {
    query.setSize(50);
    expect(query.size).toBe(50);
  });

  it('should set search and build search string', () => {
    // Testando com um exemplo simples
    query.setSearch('name:John');
    expect(query.params.length).toBeGreaterThan(0);
    expect(query.search).toContain('name:John');
  });

  it('should set sort correctly', () => {
    query.setSort('name:ASC');
    expect(query.sort).toContain('name:ASC');
  });

  it('should allow chaining using with, equals, notEquals, etc.', () => {
    query.with('status', ':', 'active').notEquals('role', 'admin');
    expect(query.params.length).toBe(2);
    expect(query.params[0]).toEqual({
      key: 'status',
      operator: ':',
      value: 'active',
      isOrOpertator: false,
    });
    expect(query.params[1]).toEqual({
      key: 'role',
      operator: '!',
      value: 'admin',
      isOrOpertator: false,
    });
  });

  it('should build the query object correctly', () => {
    query.setPage(2).setSize(30).setSort('name:DESC').setSearch('name:Alice');
    const q = query.query;
    expect(q.page).toBe(2);
    expect(q.size).toBe(30);
    expect(q.sort).toBe('name:DESC');
    expect(q.search).toContain('name:Alice');
  });

  it('static from should build a new instance from partial Query', () => {
    const partial = {
      page: 4,
      search: 'status:active',
      sort: 'name:ASC',
      size: 100,
    };
    const newQuery = SearchQuery.from(partial);
    expect(newQuery.page).toBe(4);
    expect(newQuery.size).toBe(100);
    expect(newQuery.sort.join(',')).toBe('name:ASC');
    expect(newQuery.search).toContain('status:active');
  });
});
