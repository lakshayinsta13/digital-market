import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-seller-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent implements OnInit {

  // =========================
  // DATA LISTS
  // =========================
  states: any[] = [];
  districts: any[] = [];
  markets: any[] = [];
  filteredMarkets: any[] = [];

  // =========================
  // CACHE (PERFORMANCE)
  // =========================
  districtCache: Record<number, any[]> = {};
  marketCache: Record<number, any[]> = {};

  // =========================
  // USERNAME CHECK
  // =========================
  usernameAvailable: boolean | null = null;
  isCheckingUsername = false;

  // =========================
  // UI STATE
  // =========================
  marketInput = '';
  showMarketSuggestions = false;
  isOtherMarket = false;

  isLoadingStates = false;
  isLoadingDistricts = false;
  isLoadingMarkets = false;

  // =========================
  // IMAGE
  // =========================
  selectedShopImage: File | null = null;

  // =========================
  // FORM DATA
  // =========================
  signupData = {
    state_id: 0,
    district_id: 0,
    market_id: null as number | null,
    shopkeeper_name: '',
    shop_name: '',
    shop_location: '',
    username: '',
    password: ''
  };

  constructor(private signupService: SignupService, private router: Router) { }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.loadStates();
  }

  // =========================
  // LOAD STATES
  // =========================
  loadStates(): void {
    this.isLoadingStates = true;

    this.signupService.getStates().subscribe({
      next: (data: any[]) => {
        this.states = data;
        this.isLoadingStates = false;
      },
      error: () => {
        this.isLoadingStates = false;
      }
    });
  }

  // =========================
  // STATE CHANGE → DISTRICTS
  // =========================
  onStateChange(stateId: number): void {
    if (!stateId) return;

    this.signupData.state_id = stateId;
    this.signupData.district_id = 0;
    this.districts = [];
    this.resetMarket();

    if (this.districtCache[stateId]) {
      this.districts = this.districtCache[stateId];
      return;
    }

    this.isLoadingDistricts = true;

    this.signupService.getDistricts(stateId).subscribe({
      next: (data: any[]) => {
        this.districts = data;
        this.districtCache[stateId] = data;
        this.isLoadingDistricts = false;
      },
      error: () => {
        this.isLoadingDistricts = false;
      }
    });
  }

  // =========================
  // DISTRICT CHANGE → MARKETS
  // =========================
  onDistrictChange(districtId: number): void {
    if (!districtId) return;

    this.signupData.district_id = districtId;
    this.resetMarket();

    if (this.marketCache[districtId]) {
      this.markets = this.marketCache[districtId];
      return;
    }

    this.isLoadingMarkets = true;

    this.signupService.getMarkets(districtId).subscribe({
      next: (data: any[]) => {
        this.markets = data;
        this.marketCache[districtId] = data;
        this.isLoadingMarkets = false;
      },
      error: () => {
        this.isLoadingMarkets = false;
      }
    });
  }

  // =========================
  // MARKET SEARCH
  // =========================
  onMarketInputChange(): void {
    const value = this.marketInput.trim().toLowerCase();

    if (!value) {
      this.filteredMarkets = [];
      this.showMarketSuggestions = false;
      return;
    }

    this.filteredMarkets = this.markets.filter(
      m => m.market_name?.toLowerCase().includes(value)
    );

    this.showMarketSuggestions = this.filteredMarkets.length > 0;
  }

  selectMarket(market: any): void {
    this.marketInput = market.market_name;
    this.signupData.market_id = market.market_id;
    this.isOtherMarket = false;
    this.showMarketSuggestions = false;
  }

  selectOtherMarket() {
    this.marketInput = 'Other';
    this.signupData.market_id = null; // ✅ NULL, not 0
    this.isOtherMarket = true;
    this.showMarketSuggestions = false;
  }


  // =========================
  // RESET MARKET
  // =========================
  resetMarket(): void {
    this.markets = [];
    this.filteredMarkets = [];
    this.marketInput = '';
    this.signupData.market_id = 0;
    this.showMarketSuggestions = false;
    this.isOtherMarket = false;
  }

  // =========================
  // IMAGE HANDLER
  // =========================
  onShopImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedShopImage = input.files?.[0] || null;
  }

  // =========================
  // USERNAME CHECK
  // =========================
  onUsernameChange() {
    const username = (this.signupData.username || '').trim();

    // If empty or too short → reset state
    if (username.length < 3) {
      this.usernameAvailable = null;
      this.isCheckingUsername = false;
      return;
    }

    this.isCheckingUsername = true;

    this.signupService.checkUsername(username).subscribe({
      next: (res: { available: boolean }) => {
        this.usernameAvailable = res.available;
        this.isCheckingUsername = false;
      },
      error: () => {
        this.usernameAvailable = false;
        this.isCheckingUsername = false;
      }
    });
  }

  // =========================
  // SUBMIT
  // =========================
  submitSignup(form: any): void {

    if (
      !this.signupData.state_id ||
      !this.signupData.district_id ||
      (!this.signupData.market_id && !this.isOtherMarket) ||
      !this.signupData.shopkeeper_name ||
      !this.signupData.shop_name ||
      !this.signupData.shop_location ||
      !this.signupData.username ||
      !this.signupData.password ||
      !this.selectedShopImage ||
      this.usernameAvailable !== true
    ) {
      return;
    }

    const formData = new FormData();

    Object.entries(this.signupData).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, String(value));
      }
    });

    formData.append('shop_image', this.selectedShopImage);

    this.signupService.sellerSignup(formData).subscribe({
      next: () => {
        alert('Signup successful 🎉');

        // ✅ RESET FORM
        form.resetForm();

        // ✅ RESET EXTRA STATE
        this.selectedShopImage = null;
        this.marketInput = '';
        this.filteredMarkets = [];
        this.showMarketSuggestions = false;
        this.isOtherMarket = false;
        this.usernameAvailable = null;

        // ✅ AUTO NAVIGATE TO LOGIN
        // ✅ DELAY NAVIGATION (1 second)
        setTimeout(() => {
          this.router.navigate(['/seller/login']);
        }, 1000); // 1000ms = 1 second
      },
      error: () => alert('Signup failed')
    });
  }


  // =========================
  // TRACK BY
  // =========================
  trackById(_: number, item: any): number {
    return item.state_id || item.district_id || item.market_id;
  }

}
