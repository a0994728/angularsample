import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './modk-heroes';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private heroesUrl = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetch heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updateHero id=${hero.id}`))
    );
  }

  addHero(name: string): Observable<any> {
    return this.http
      .post<Hero>(this.heroesUrl, { name }, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<any>(`addHero`))
      );
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((_) => this.log(`found heroes matching "${term}"`)),
      tap((heroes) => this.log(`"${term}" match ${heroes.length} heroes`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  getHeroNo404<Data>(id: string): Observable<Hero | null> {
    if (!id.trim()) {
      return of(null);
    }
    const num = Number(id);
    if (Number.isNaN(num)) {
      return of(null).pipe(tap((_) => this.log('please enter valid numbers')));
    }
    const url = `${this.heroesUrl}/?id=${num}`;

    return this.http.get<Hero[]>(url).pipe(
      map((heroes) => heroes[0]),
      tap((h) => {
        const outLine = h ? 'fetch' : 'cannot be found';
        this.log(`${outLine} hero id=${num}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${num}`))
    );
  }
}
