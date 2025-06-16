import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../SecurityModels/auth.service';
import { AuthRequest } from '../../SecurityModels/auth-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model!: AuthRequest;
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // UI State
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  rememberMe = false;

  constructor() {
    this.model = new AuthRequest();
    // redirect to home if already logged in
    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
  }

  login(event: Event) {
    event.preventDefault();

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Client side validation
    if (!this.isFormValid()) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin đã nhập';
      return;
    }

    this.isLoading = true;

    console.log(`Login: ${this.model.email}`);

    this.authService
      .login(this.model)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success) {
            this.successMessage = response.message || 'Đăng nhập thành công!';
            
            // Store remember me preference
            if (this.rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberMe');
            }

            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Đăng nhập thất bại';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            this.errorMessage = error.error.errors.join(', ');
          } else if (error.status === 401) {
            this.errorMessage = 'Email hoặc mật khẩu không đúng';
          } else if (error.status === 0) {
            this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
          } else {
            this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
          }
        }
      });
  }

  // Password visibility toggle
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Form validation
  isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  isEmailValid(): boolean {
    if (!this.model.email) return false;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.model.email);
  }

  isPasswordValid(): boolean {
    return this.model.password != null && this.model.password.length >= 4;
  }

  // Forgot password handler
  onForgotPassword(event: Event) {
    event.preventDefault();
    // TODO: Implement forgot password functionality
    alert('Tính năng quên mật khẩu sẽ được phát triển trong tương lai.');
  }
}
