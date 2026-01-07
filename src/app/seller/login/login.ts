import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// ✅ CORRECT IMPORT (MATCHES YOUR STRUCTURE)
import { LoginServices, LoginResponse } from '../../services/login.services';

@Component({
  selector: 'app-seller-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginData = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private loginService: LoginServices,
    private router: Router
  ) { }

  submitLogin(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.loginService.sellerLogin(this.loginData).subscribe({
      next: (res: LoginResponse) => {
        this.isLoading = false;

        // ✅ Save session
        localStorage.setItem('seller_id', String(res.seller_id));
        localStorage.setItem('username', res.username);

        // ✅ Navigate
        this.router.navigate(['/seller/my-shop']);

      },
      error: (err: any) => {
        this.isLoading = false;

        if (err.error?.errorType === 'PASSWORD_WRONG') {
          this.errorMessage = 'Incorrect password';
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      }
    });
  }
}
