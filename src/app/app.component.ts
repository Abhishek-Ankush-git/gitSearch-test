import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IRepoDetails } from './interfaces/IRepoDetails';
import { IResponse } from './interfaces/IResponse';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'gitSearch';
  searchText: string;
  searchResults: IRepoDetails[] = [];
  autocomplete: IRepoDetails[] = [];
  private searchDecouncer: Subject<string> = new Subject();
  debouncedInputValue: string;

  constructor(private _http: HttpClient) { }

  public ngOnInit(): void {
    // Setup debouncer
    this.setupSearchDebouncer();
  }

  setupSearchDebouncer(): void {
    this.searchDecouncer.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      // Remember value after debouncing
      this.debouncedInputValue = term;
      this._http.get(`https://api.github.com/search/repositories?q=${term}`, { responseType: 'json' }).subscribe(
        (response: IResponse) => {
          this.autocomplete = response.items;
        }, (error: any) => {
          console.error(error);
        }
      );
    });
  }

  autoComplete(text: string): void {
    this.searchDecouncer.next(text);
  }

  searchGitRepo(): void {
    if (this.searchText && this.searchText !== '') {
      this._http.get(`https://api.github.com/search/repositories?q=${this.searchText}`, { responseType: 'json' }).subscribe(
        (response: IResponse) => {
          this.searchResults = response.items;
        }, (error: any) => {
          console.error(error);
        }
      )
    }
  }

  openRepo(url:string) {
    window.open(url, '');
  }
}
