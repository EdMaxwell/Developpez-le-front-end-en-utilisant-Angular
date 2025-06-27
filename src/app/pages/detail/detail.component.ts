import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';

import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

import {OlympicService} from 'src/app/core/services/olympic.service';
import IOlympicCountry from "../../core/models/Olympic";


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
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public country$!: Observable<IOlympicCountry | null | undefined>;
  public countryStats$!: Observable<{
    participationCount: number;
    totalMedals: number;
    totalAthletes: number;
  }>;
  public medalSeries$!: Observable<LineChartSeries[]>;

  // options ngx-charts
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
    private location: Location
  ) {
  }

  ngOnInit(): void {
    // 1) Charger les données globales
    this.olympicService.loadInitialData().subscribe();

    // 2) Récupérer l’ID et le pays
    this.country$ = this.activatedRoute.paramMap.pipe(
      map(pm => Number(pm.get('id'))),
      filter(id => !isNaN(id)),
      switchMap(id => this.olympicService.getCountryById(id))
    );

    // 3) Stats globales
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

    // 4) Série pour le line-chart
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

  public goBack(): void {
    this.location.back();
  }
}
