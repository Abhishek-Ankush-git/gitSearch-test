import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IRepoDetails } from './interfaces/IRepoDetails';
import { IResponse } from './interfaces/IResponse';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'gitSearch';
  searchText: string;
  searchResults: IRepoDetails[] = [];
  autocomplete: IRepoDetails[] = [];
  isSearched = false;
  private searchDecouncer: Subject<string> = new Subject();
  debouncedInputValue: string;

  constructor(private _http: HttpClient) { }
  
  /**
   * @returns void
   */
  public ngOnInit(): void {
    // Setup debouncer
    this.setupSearchDebouncer();
  }
  
  /**
   * sets up the search debouncer for autocomplete
   * @returns void
   */
  setupSearchDebouncer(): void {
    this.searchDecouncer.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      // Remember value after debouncing
      this.debouncedInputValue = term;
      this._http.get(`https://api.github.com/search/repositories?q=${this.normalizeValue(term)}`, { responseType: 'json' }).subscribe(
        (response: IResponse) => {
          this.autocomplete = response.items;
        }, (error: any) => {
          console.error(error);
        }
      );
    });
  }

  /**
   * normalizes the value of the provided string
   * @param  {string} value
   * @returns string
   */
  private normalizeValue(value: string): string{
    return value.toLowerCase().replace(/\s/g, '')
  }

  /**
   * starts the autocomplete
   * @param  {string} text
   * @returns void
   */
  autoComplete(text: string): void {
    this.searchDecouncer.next(text);
  }

  /**
   * searches for repositories with the entered search text
   * @returns void
   */
  searchGitRepo(): void {
    if (this.searchText && this.searchText !== '') {
      this.isSearched = true;
      this._http.get(`https://api.github.com/search/repositories?q=${this.normalizeValue(this.searchText)}`, { responseType: 'json' }).subscribe(
        (response: IResponse) => {
          this.searchResults = response.items;
        }, (error: any) => {
          console.error(error);
        }
      )
    }
  }
  
  /**
   * opens a new window with provided url
   * @param  {string} url
   * @returns void
   */
  openRepo(url:string): void {
    window.open(url, '');
  }
}
