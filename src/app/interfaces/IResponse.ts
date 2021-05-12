import { IRepoDetails } from './IRepoDetails';

export interface IResponse {
    total_count: number;
    incomplete_results: boolean;
    items: IRepoDetails[];
}