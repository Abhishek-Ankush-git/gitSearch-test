import { IOwnerDetails } from "./IOwnerDetails";

export interface IRepoDetails {
    owner: IOwnerDetails;
    html_url: string;
    name: string;
    description?: string;
    license?: {[key: string]: string};
    size: number;
    forks: number;
    watchers: number;
    open_issues_count: number;
    created_at?: string;
    updated_at?: string;
}