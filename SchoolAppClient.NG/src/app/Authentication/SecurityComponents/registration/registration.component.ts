import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../SecurityModels/auth.service';
import { RegistrationRequest } from '../../SecurityModels/RegistrationRequest';
import { Router } from '@angular/router';
import { AuthRegRequest } from '../../SecurityModels/AuthRegRequest';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  @ViewChild('registrationForm') registrationForm!: NgForm;
  model = new AuthRegRequest();
  
  // UI State
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  agreeToTerms = false;

  // Services
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    // Redirect to home if already logged in
    if (this.authService.userValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  register(event: Event) {
    event.preventDefault();
    
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Client side validation
    if (!this.isFormValid()) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin đã nhập';
      return;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'Vui lòng đồng ý với điều khoản dịch vụ và chính sách bảo mật';
      return;
    }

    this.isLoading = true;

    console.log(`Registering user: ${this.model.email}`);

    this.authService.register(this.model).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Đăng ký thành công! Đang chuyển hướng...';
          
          // Automatically log in the user after successful registration
          setTimeout(() => {
            const loginModel = {
              email: this.model.email,
              password: this.model.password
            };
            
            this.authService.login(loginModel).subscribe({
              next: (loginResponse) => {
                if (loginResponse.success) {
                  this.router.navigate(['/dashboard']);
                } else {
                  // If auto-login fails, redirect to login page
                  this.router.navigate(['/login'], { 
                    queryParams: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
                  });
                }
              },
              error: () => {
                // If auto-login fails, redirect to login page
                this.router.navigate(['/login'], { 
                  queryParams: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
                });
              }
            });
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Đăng ký thất bại';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
          this.errorMessage = error.error.errors.join(', ');
        } else if (error.status === 400) {
          this.errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (error.status === 409) {
          this.errorMessage = 'Email hoặc tên người dùng đã tồn tại.';
        } else if (error.status === 0) {
          this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
        } else {
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
      }
    });
  }

  // Password visibility toggles
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Form validation
  isFormValid(): boolean {
    return this.model.isEmailValid() && 
           this.model.isUsernameValid() && 
           this.model.isPasswordValid() && 
           this.model.doPasswordsMatch();
  }

  // Password strength helpers
  hasMinLength(): boolean {
    return this.model.password.length >= 8;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.model.password);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.model.password);
  }

  hasNumber(): boolean {
    return /\d/.test(this.model.password);
  }

  hasSpecialChar(): boolean {
    return /[@$!%*?&#+\-_]/.test(this.model.password);
  }

  // Terms and Privacy handlers
  showTerms(event: Event) {
    event.preventDefault();
    // TODO: Show terms modal or navigate to terms page
    alert('Điều khoản dịch vụ sẽ được hiển thị ở đây.');
  }

  showPrivacy(event: Event) {
    event.preventDefault();
    // TODO: Show privacy modal or navigate to privacy page  
    alert('Chính sách bảo mật sẽ được hiển thị ở đây.');
  }
}
