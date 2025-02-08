import { CommonModule, NgClass } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as _ from 'underscore';

import { ButtonModule } from 'primeng/button'
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton'

import { GetDataService } from './@services/get-data.service';
import { interval } from 'rxjs';
import { TargetService } from './@services/target.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,

    ButtonModule,
    SkeletonModule,
    CarouselModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  isLoading: boolean = true
  sliderData: any[] = []
  constructor(private getData: GetDataService, private targetService: TargetService) { }
  ngOnInit(): void {
    this.checkForTarget()
    setTimeout(() => {
      this.getData.getMarketData().subscribe(
        (data) => {
          this.sliderData.push(data.top_gainers.slice(0, 5))
          this.sliderData.push(data.top_losers.slice(0, 5))
          this.sliderData.push(data.most_actively_traded.slice(0, 5))
          this.sliderData = this.sliderData.flat()
          this.sliderData = _.shuffle(this.sliderData)
          this.isLoading = false
        }
      )
    }, 3000);
    // interval(10000).subscribe(() => this.checkForTarget())
  }
  checkForTarget() {
    console.log('target chacked !!')
    const targets = this.targetService.getTargets()
    targets.forEach(target => {
      if (target.stock.realTimePrice >= target.targetPrice) {
        this.targetService.removeTarget(target.stock.symbol)
        this.targetService.sendEmail(target.stock, target.targetPrice)
      }
    })
  }
}
