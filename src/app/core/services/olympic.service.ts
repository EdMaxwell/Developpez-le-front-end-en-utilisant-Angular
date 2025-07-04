import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import IOlympicCountry from "../models/Olympic";
import IParticipation from "../models/Participation";

/**
 * Service for managing and providing Olympic data.
 * Handles data loading, caching, and access to countries and participations.
 */
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<IOlympicCountry[] | null | undefined>(undefined);

  constructor(private http: HttpClient) {
  }

  /**
   * Loads the initial Olympic data from the JSON file.
   * Emits the data to subscribers or null in case of error.
   * @returns Observable emitting the loaded data or null on error.
   */
  loadInitialData(): Observable<IOlympicCountry[] | null> {
    return this.http.get<IOlympicCountry[]>(this.olympicUrl).pipe(
      tap((countries) => this.olympics$.next(countries)),
      catchError(() => {
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  /**
   * Returns an observable of the full Olympic countries list.
   */
  getOlympics(): Observable<IOlympicCountry[] | null | undefined> {
    return this.olympics$.asObservable();
  }

  /**
   * Returns an observable of a country by its ID.
   * Emits undefined if data is loading, null if not found or error.
   * @param id Country ID
   */
  getCountryById(id: number): Observable<IOlympicCountry | null | undefined> {
    return this.olympics$.pipe(
      map(list => {
        if (list === undefined) return undefined;
        if (list === null) return null;
        return list.find(c => c.id === id) ?? null;
      })
    );
  }

  /**
   * Returns an observable of a participation for a given country and year.
   * Emits undefined if not found.
   * @param countryId Country ID
   * @param year Olympic year
   */
  getParticipation(countryId: number, year: number): Observable<IParticipation | undefined> {
    return this.getCountryById(countryId).pipe(
      map(country =>
        country?.participations.find(p => p.year === year)
      )
    );
  }
}
