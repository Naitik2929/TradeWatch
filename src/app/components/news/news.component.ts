import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  news: any[] = []

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    // fetchData()
  }

  fetchData() {
    // this.http.get()
  }
}
