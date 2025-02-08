import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Target } from '../../@models/stocks.model';
import { TargetService } from '../../@services/target.service';

import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-targets',
  standalone: true,
  imports: [

    TableModule,
    ButtonModule

  ],
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.css'
})
export class TargetsComponent implements OnInit {
  targets!: Target[]

  constructor(private targetService: TargetService) { }

  ngOnInit(): void {
    this.fetchData()
  }
  
  fetchData() {
    this.targets = this.targetService.getTargets()
  }
  
}
