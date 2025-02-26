export default interface PaginationDTO<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}
