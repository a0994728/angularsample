import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './modk-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private messageService: MessageService) {}

  getHeroes(): Observable<Hero[]> {
    const heroes = of<Hero[]>(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> | undefined {
    const hero = HEROES.find((e) => (e.id = id));
    if (!hero) {
      return undefined;
    }
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}
