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


  getCountryById(id: number): Observable<IOlympicCountry | null | undefined> {
    return this.olympics$.pipe(
      map(list => {
        if (list === undefined) return undefined; // chargement
        if (list === null) return null; // erreur de chargement
        return list.find(c => c.id === id) ?? null; // null si pas trouvé
      })
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
