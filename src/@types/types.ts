export interface IApiResponse<T> {
  message: string;
  statusCode: number;
  status: boolean;
  response: T;
  pagination?: {
    totalCount: number;
    page: number;
    limit: number;
  };
}
