import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Mutualfund, MutualfundData } from '../../@models/mfs.model';
import { MfsService } from '../../@services/mfs.service';

import * as Highcharts from 'highcharts'
import { HighchartsChartModule } from 'highcharts-angular'

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete'
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart'
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import moment from 'moment'

@Component({
  selector: 'app-fund-compare',
  standalone: true,
  imports: [

    FormsModule,
    CommonModule,

    HighchartsChartModule,
    ChartModule,
    
    AutoCompleteModule,
    ButtonModule,
    ProgressSpinnerModule,

  ],
  templateUrl: './fund-compare.component.html',
  styleUrl: './fund-compare.component.css'
})
export class FundCompareComponent implements OnInit {
  mutualfunds!: Mutualfund[]
  highcharts = Highcharts
  mf1!: Mutualfund
  mf2!: Mutualfund
  mf1Data!: MutualfundData
  mf2Data!: MutualfundData
  filteredMutualFunds!: Mutualfund[]
  showResult: boolean = false
  chartOptions!: Highcharts.Options
  isLoading: boolean = false

  constructor(private mfsService: MfsService) { }
  ngOnInit(): void {
    this.mfsService.getData().subscribe(res => {
      this.mutualfunds = res
    })
  }
  filterMutualFunds(event: AutoCompleteCompleteEvent) {
    const query = event.query
    let filtered: Mutualfund[] = []
    if (query) {
      for (let index = 0; index < this.mutualfunds.length; index++) {
        const mutualfund = this.mutualfunds[index];
        if (mutualfund.schemeName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(mutualfund)
        }
      }
      this.filteredMutualFunds = filtered
    }
    else {
      this.filteredMutualFunds = []
    }
  }

  onShowResult() {
    this.isLoading = true
    this.mfsService.getMutualFund(this.mf1.schemeCode).subscribe(
      (response) => {
        this.mf1Data = response;
        this.checkAndRenderChart();
      }
    );
    this.mfsService.getMutualFund(this.mf2.schemeCode).subscribe(
      (response) => {
        this.mf2Data = response;
        this.checkAndRenderChart();
      }
    );
  }

  checkAndRenderChart() {
    if (this.mf1Data && this.mf2Data) {
      this.isLoading = false
      this.chartOptions = this.chartOptions = {
        title: {
          text: 'Mutual Fund Comparison',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        xAxis: {
          categories: this.mf1Data.data.length > this.mf2Data.data.length ? this.mf1Data.data.map(data => data.date) : this.mf2Data.data.map(data => data.date),
          reversed: true,
          title: {
            text: 'Date (DD-MM-YYYY)',
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#555'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              color: '#666'
            }
          }
        },
        yAxis: {
          title: {
            text: 'NAV (₹)',
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#555'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              color: '#666'
            }
          }
        },
        series: [
          {
            name: this.mf1Data.meta.scheme_name,
            type: 'line',
            data: this.mf1Data.data.map(date => +date.nav),
            color: '#007BFF',
            marker: {
              enabled: false
            }
          },
          {
            name: this.mf2Data.meta.scheme_name,
            type: 'line',
            data: this.mf2Data.data.map(date => +date.nav),
            color: '#FF5733',
            marker: {
              enabled: false
            }
          }
        ],
        tooltip: {
          shared: true,
          valueDecimals: 2,
          valuePrefix: '₹',
          style: {
            fontSize: '14px',
            color: '#333'
          }
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          itemStyle: {
            fontSize: '12px',
            color: '#333'
          }
        },
        plotOptions: {
          series: {
            lineWidth: 2
          }
        },
        chart: {
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd'
        }
      };
      this.showResult = true;
    }
  }


  getPercent(num1: number | undefined, num2: number) {
    if (num1) {
      return ((num2 - num1) / (num2)) * 100
    }
    return 0
  }

  getXYearReturn(index: number, year: number) {
    if (index == 1) {
      const currDate = this.mf1Data.data[0].date
      const prevDate = moment(currDate, 'DD-MM-YYYY').subtract(year, 'years').format('DD-MM-YYYY')
      const currNav = this.mf1Data.data[0].nav
      const prevNav = this.mf1Data.data.find(data => data.date == prevDate)?.nav || 0
      return this.getPercent(prevNav, currNav)
    }
    else {
      const currDate = this.mf2Data.data[0].date
      const prevDate = moment(currDate, 'DD-MM-YYYY').subtract(year, 'years').format('DD-MM-YYYY')
      const currNav = this.mf2Data.data[0].nav
      const prevNav = this.mf2Data.data.find(data => data.date == prevDate)?.nav || 0
      return this.getPercent(prevNav, currNav)
    }
  }
}
