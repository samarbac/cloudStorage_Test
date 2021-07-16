import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  /**boolean */
  isLinear = true;
  /**form group */
  firstStep: FormGroup;
  secondStep: FormGroup;
  thirdStep: FormGroup;
  /**array */
  durationList: any = [{ id: 1, libelle: 3 }, { id: 2, libelle: 6 }, { id: 3, libelle: 12 }]
  quantityList: any = [{ id: 1, libelle: 5 }, { id: 2, libelle: 10 }, { id: 3, libelle: 50 }]
  subPriceArray: any = {
    "subscription_plans": [
      {
        "duration_months": 3,
        "price_usd_per_gb": 3
      },
      {
        "duration_months": 6,
        "price_usd_per_gb": 2.5
      },
      {
        "duration_months": 12,
        "price_usd_per_gb": 2
      }
    ]

  }
  /**number */
  totalPrice = 0
  quantityPerGB = 0
  duration = 0;
  getsubPrice: any;
  /**date */
  minDateValidators = new Date()
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) { }
  ngOnInit() {
    this.createForm();
    this.selectedDurationQuantity()
  }
  createForm() {
    this.firstStep = this.fb.group({
      duration: [this.durationList.find(data => data.libelle == 12), Validators.required],
      quantity: [this.quantityList.find(data => data.libelle == 5), Validators.required],
      upfront: [false, Validators.required]
    });
    this.secondStep = this.fb.group({
      cardNumber: [null, [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(14)]],
      dateExpired: [null, Validators.required],
      codeSecurity: [null, [Validators.required, Validators.minLength(3)]]
    });
    this.thirdStep = this.fb.group({
      emailID: ['', [Validators.required, Validators.email]],
      termCondition: [null, Validators.required]
    });

  }
  /**calcul total price by duration/gb/reduction */
  selectedDurationQuantity() {
    this.duration = this.firstStep.get("duration").value.libelle
    this.quantityPerGB = this.firstStep.get("quantity").value.libelle
    this.getsubPrice = this.subPriceArray.subscription_plans.find(data => data.duration_months == this.duration)
    this.totalPrice = this.getsubPrice ? (this.quantityPerGB * this.getsubPrice.price_usd_per_gb) : this.quantityPerGB
    let upfrontPay = this.firstStep.get("upfront").value
    if (upfrontPay) {
      let mntRedu = (this.totalPrice * 10) / 100
      this.totalPrice = mntRedu ? (this.totalPrice - mntRedu) : this.totalPrice
    }
  }

  /**open modal confirmation */
  saveInformation(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '550px'
    });
  }
  /**reset form */
  resetForm() {
    this.dialog.closeAll()
    this.router.navigate(["/home"]);
  }
}
