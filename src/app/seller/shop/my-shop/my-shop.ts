import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LoginServices,
  SellerProfile,
  SellerProfileResponse
} from '../../../services/login.services';
import { DrawerComponent } from '../drawer/drawer';

@Component({
  selector: 'app-my-shop',
  standalone: true,
  imports: [
    CommonModule,     // ✅ for *ngIf
    DrawerComponent   // ✅ for <app-drawer>
  ],
  templateUrl: './my-shop.html',
  styleUrls: ['./my-shop.css']
})
export class MyShopComponent implements OnInit {

  seller!: SellerProfile;
  isDrawerOpen = false;

  constructor(
    private router: Router,
    private loginService: LoginServices
  ) { }

  ngOnInit(): void {
    const storedSeller = localStorage.getItem('seller');
    if (!storedSeller) return;

    const sellerData = JSON.parse(storedSeller);

    this.loginService
      .getSellerProfile(sellerData.seller_id)
      .subscribe((res: SellerProfileResponse) => {
        this.seller = res.seller;
      });
  }

  goTo(path: string): void {
    this.router.navigate([`/seller/my-shop/${path}`]);
  }

  openDrawer(): void {
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }
}
