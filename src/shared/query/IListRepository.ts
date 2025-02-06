import PaginationDTO from '../dtos/PaginationDTO';
import SearchQuery from './SearchQuery';

export default interface IListRepository<T> {
  findAll(search: SearchQuery): Promise<PaginationDTO<T>>;
}
