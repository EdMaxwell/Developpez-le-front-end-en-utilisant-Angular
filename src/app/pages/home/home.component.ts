import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatToolbarModule} from '@angular/material/toolbar';

import {OlympicService} from 'src/app/core/services/olympic.service';
import IOlympicCountry from "../../core/models/Olympic";


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
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public chartData$!: Observable<ChartItem[]>;
  // chart options
  public view: [number, number] = [700, 400];
  public showLegend = false;
  public showLabels = true;
  public isDoughnut = false;
  private _chartItems: ChartItem[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();

    this.chartData$ = this.olympicService.getOlympics().pipe(
      filter((list): list is IOlympicCountry[] => Array.isArray(list)),
      map(list =>
        list.map(country => ({
          name: country.country,
          value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
          id: country.id,
        }))
      ),
      tap(items => this._chartItems = items)
    );
  }

  public onSelect(event: { name: string; value: number }): void {
    const clicked = this._chartItems.find(i => i.name === event.name);
    if (clicked) {
      this.router.navigate(['country', clicked.id]);
    }
  }

  OnDestroy(): void {
    // deleteOnsubrscibe
  }
}
