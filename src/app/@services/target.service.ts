import { Injectable } from '@angular/core';
import { GlobalObservablesService } from './global-observables.service';

import emailjs from 'emailjs-com';
import { Stock } from '../@models/stocks.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  constructor(private globalService: GlobalObservablesService) { }
  getTargets() {
    return this.globalService.Targets
  }

  removeTarget(symbol: string) {
    const currTarget = this.globalService.Targets
    const updatedTarget = currTarget.filter(target => target.stock.symbol !== symbol)
    this.globalService.updateTargets(updatedTarget)
  }

  sendEmail(stock: Stock, targetPrice: number) {
    emailjs.init(environment.userId);
    const templateParams = {
      to_name: 'Naitik Patel',
      from_name: 'Stock List - ALl in one',
      message: `Stoploss for stock ${stock.symbol} of $${targetPrice} hitted!`,
    };
    emailjs.send(environment.serviceId, environment.templateId, templateParams)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  }
}
