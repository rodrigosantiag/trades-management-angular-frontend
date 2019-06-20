import {Component, OnInit} from '@angular/core';
import {getCurrencySymbol} from '@angular/common';
import * as CanvasJS from '../../assets/canvasjs.min';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  public currencyCode: string;

  constructor() {
    this.currencyCode = getCurrencySymbol('USD', 'wide');
  }

  ngOnInit() {
    const dataPoints = [];
    let y = 0;
    for (let i = 0; i < 100; i++) {
      y += Math.round(21151.94 + Math.random() * (-21151.94 - 21151.94));
      dataPoints.push({y});
    }
    const chart = new CanvasJS.Chart('chartContainer', {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      subtitles: [{
        text: 'Try Zooming and Panning'
      }],
      data: [
        {
          type: 'line',
          dataPoints
        }]
    });

    chart.render();
  }

}
