import { Component } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent {
  constructor(private heroService: HeroService) {}
  hero: Hero = {
    id: 1,
    name: 'Windstorm',
  };
  heroes: Hero[] = [];

  getHeroes(): void {
    console.log('getHeroes');
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getHeroes();
  }
}
