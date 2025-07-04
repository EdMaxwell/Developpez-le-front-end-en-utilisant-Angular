import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject, takeUntil} from 'rxjs';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';

import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

import {OlympicService} from 'src/app/core/services/olympic.service';
import IOlympicCountry from "../../core/models/Olympic";
import {ErrorMessageComponent} from "../../shared/error-message/error-message.component";
import {LoadingSpinnerComponent} from "../../shared/loading-spinner/loading-spinner.component";

interface LineChartSeries {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ErrorMessageComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {

  /** Observable for the selected country */
  public country$!: Observable<IOlympicCountry | null | undefined>;
  public countryStats$!: Observable<{
    participationCount: number;
    totalMedals: number;
    totalAthletes: number;
  }>;
  public medalSeries$!: Observable<LineChartSeries[]>;
  private destroy$ = new Subject<void>();

  /** Error state for data loading */
  public hasError = false;
  public countryNotFound = false;

  // ngx-charts options
  public viewSize: [number, number] = [700, 300];
  public showXAxis = true;
  public showYAxis = true;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Year';
  public showYAxisLabel = true;
  public yAxisLabel = 'Medals';
  public timeline = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  /**
   * Angular lifecycle hook. Initializes the component.
   */
  ngOnInit(): void {
    this.loadGlobalData();
    this.initCountryObservable();
    this.initCountryStatsObservable();
    this.initMedalSeriesObservable();
  }

  /**
   * Loads the global olympic data.
   * Unsubscribes automatically on component destroy.
   */
  private loadGlobalData(): void {
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  /**
   * Initializes the country$ observable based on the route parameter.
   */
  private initCountryObservable(): void {
    this.country$ = this.activatedRoute.paramMap.pipe(
      map(pm => Number(pm.get('id'))),
      filter(id => !isNaN(id)),
      switchMap(id => this.olympicService.getCountryById(id).pipe(
        catchError(err => {
          this.hasError = true;
          this.countryNotFound = false;
          return [null];
        })
      )),
      tap(country => {
        if (country === null) {
          this.hasError = true;
          this.countryNotFound = true; // pays non trouvé
        } else if (country === undefined) {
          this.hasError = false;
          this.countryNotFound = false; // chargement
        } else {
          this.hasError = false;
          this.countryNotFound = false; // pays trouvé
        }
      })
    );
  }

  /**
   * Initializes the countryStats$ observable with participation, medals, and athletes stats.
   */
  private initCountryStatsObservable(): void {
    this.countryStats$ = this.country$.pipe(
      map(country => {
        if (!country) {
          return {participationCount: 0, totalMedals: 0, totalAthletes: 0};
        }
        const participationCount = country.participations.length;
        const totalMedals = country.participations
          .reduce((acc, p) => acc + p.medalsCount, 0);
        const totalAthletes = country.participations
          .reduce((acc, p) => acc + p.athleteCount, 0);
        return {participationCount, totalMedals, totalAthletes};
      })
    );
  }

  /**
   * Initializes the medalSeries$ observable for the line chart.
   */
  private initMedalSeriesObservable(): void {
    this.medalSeries$ = this.country$.pipe(
      map(country => {
        if (!country) return [];
        const series = country.participations
          .slice()
          .sort((a, b) => a.year - b.year)
          .map(p => ({name: String(p.year), value: p.medalsCount}));
        return [{name: country.country, series}];
      })
    );
  }

  /**
   * Angular lifecycle hook. Cleans up subscriptions on destroy.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navigates back to the previous page.
   */
  public goBack(): void {
    this.router.navigate(['/']);
  }
}
