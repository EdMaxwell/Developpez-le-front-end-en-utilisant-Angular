import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {catchError, Observable, of, Subject, takeUntil} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatToolbarModule} from '@angular/material/toolbar';

import {OlympicService} from 'src/app/core/services/olympic.service';
import {ErrorMessageComponent} from "../../shared/error-message/error-message.component";
import {LoadingSpinnerComponent} from "../../shared/loading-spinner/loading-spinner.component";

interface ChartItem {
  name: string;
  value: number;
  id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatToolbarModule,
    ErrorMessageComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  /** Observable for chart data */
  public chartData$!: Observable<ChartItem[]>;
  /** Error state for data loading */
  public hasError = false;

  /** Chart configuration */
  public view: [number, number] = [700, 400];
  public showLegend = false;
  public showLabels = true;
  public isDoughnut = false;
  private destroy$ = new Subject<void>();
  private _chartItems: ChartItem[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  /**
   * Angular lifecycle hook. Initializes the component.
   */
  ngOnInit(): void {
    this.loadGlobalData();
    this.initChartDataObservable();
  }

  /**
   * Loads the global olympic data.
   * Unsubscribes automatically on component destroy.
   * Sets hasError to true if loading fails.
   */
  private loadGlobalData(): void {
    this.olympicService.loadInitialData()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.hasError = true;
          return of();
        })
      )
      .subscribe();
  }

  /**
   * Initializes the chartData$ observable for the chart.
   */
  private initChartDataObservable(): void {
    this.chartData$ = this.olympicService.getOlympics().pipe(
      map(list => {
        if (list === null) {
          this.hasError = true;
          return [];
        }
        if (!Array.isArray(list)) {
          return [];
        }
        return list.map(country => ({
          name: country.country,
          value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
          id: country.id,
        }));
      }),
      tap(items => this._chartItems = items)
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
   * Handles chart item selection and navigates to the country detail page.
   * @param event The selected chart item event.
   */
  public onSelect(event: { name: string; value: number }): void {
    const clicked = this._chartItems.find(i => i.name === event.name);
    if (clicked) {
      this.router.navigate(['country', clicked.id]);
    }
  }
}
