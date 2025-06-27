import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import IOlympicCountry from "../models/Olympic";
import IParticipation from "../models/Participation";


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<IOlympicCountry[] | null | undefined>(undefined);

  constructor(private http: HttpClient) {
  }

  loadInitialData(): Observable<IOlympicCountry[] | null> {
    return this.http.get<IOlympicCountry[]>(this.olympicUrl).pipe(
      tap((countries) => this.olympics$.next(countries)),
      catchError((err) => {
        console.error('Erreur de chargement des données JO', err);
        // on émet `null` pour signaler l’erreur aux abonnés
        this.olympics$.next(null);
        // on retourne un `of(null)` pour que l’abonné de loadInitialData voie aussi `null`
        return of(null);
      })
    );
  }

  getOlympics(): Observable<IOlympicCountry[] | null | undefined> {
    return this.olympics$.asObservable();
  }


  getCountryById(id: number): Observable<IOlympicCountry | undefined> {
    return this.olympics$.pipe(
      // si undefined (pas encore chargé) ou null (erreur), on transmet tel quel
      map(list => Array.isArray(list) ? list.find(c => c.id === id) : undefined)
    );
  }

  getParticipation(countryId: number, year: number): Observable<IParticipation | undefined> {
    return this.getCountryById(countryId).pipe(
      map(country =>
        country?.participations.find(p => p.year === year)
      )
    );
  }
}
