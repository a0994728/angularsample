import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  constructor(private heroService: HeroService) {}

  heroes$!: Observable<Hero[]>;
  hero$!: Observable<Hero | null>;
  private searchTerm = new Subject<string>();
  private searchIdTerm = new Subject<string>();
  search(term: string): void {
    this.searchTerm.next(term);
  }

  searchById(strId: string): void {
    this.searchIdTerm.next(strId);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );

    this.hero$ = this.searchIdTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((idTerm: string) => this.heroService.getHeroNo404(idTerm))
    );
  }
}
