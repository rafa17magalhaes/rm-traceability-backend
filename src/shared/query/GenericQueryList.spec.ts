import PaginationDTO from '../dtos/PaginationDTO';
import GenericQueryList, { QueryParams } from './GenericQueryList';
import SearchQuery from './SearchQuery';

type Dummy = { id: number; name: string };

const mockRepository = {
  findAll: jest.fn(
    (searchQuery: SearchQuery): Promise<PaginationDTO<Dummy>> => {
      return Promise.resolve({
        data: [{ id: 1, name: 'Test' }],
        page: searchQuery.page,
        size: searchQuery.size,
        total: 1,
      });
    },
  ),
};

describe('GenericQueryList', () => {
  let genericQueryList: GenericQueryList<Dummy>;

  beforeEach(() => {
    genericQueryList = new GenericQueryList<Dummy>(mockRepository);
  });

  it('should call repository.findAll with the correct SearchQuery when list is invoked', async () => {
    const params: QueryParams = {
      page: '2',
      search: 'name:Test',
      sort: 'name:ASC',
      filters: { extra: 'value' },
    };

    const result = await genericQueryList.list(params);

    expect(mockRepository.findAll).toHaveBeenCalled();
    expect(result.page).toBe(2);
    expect(result.data).toEqual([{ id: 1, name: 'Test' }]);
  });

  it('should use default values if no parameters are provided', async () => {
    const result = await genericQueryList.list({});
    expect(result.page).toBe(1);
    expect(result.size).toBe(999999);
  });
});
