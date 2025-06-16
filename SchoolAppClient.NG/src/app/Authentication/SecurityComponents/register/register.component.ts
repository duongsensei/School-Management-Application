import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRegRequest } from '../../SecurityModels/AuthRegRequest';
import { AuthService } from '../../SecurityModels/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model!: AuthRegRequest;
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // UI State
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedRole = 'Student';

  constructor() {
    this.model = new AuthRegRequest();
    // redirect to home if already logged in
    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
  }

  submit(event: Event) {
    event.preventDefault();

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Set role from selection
    this.model.role = [this.selectedRole];

    // Client side validation
    if (!this.isFormValid()) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin đã nhập';
      return;
    }

    this.isLoading = true;

    console.log('Registering:', this.model.email);

    this.authService
      .register(this.model)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = response.message || 'Đăng ký thành công!';
            setTimeout(() => {
              this.router.navigateByUrl('/login?returnUrl=' + this.route.snapshot.queryParams['returnUrl']);
            }, 2000);
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
           this.model.doPasswordsMatch() &&
           this.selectedRole.length > 0;
  }

  // Password strength helpers
  getPasswordStrengthClass(): string {
    const password = this.model.password;
    
    if (password.length === 0) return '';
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    
    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    
    // Number check
    if (/\d/.test(password)) score++;
    
    // Special character check
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strengthClass = this.getPasswordStrengthClass();
    
    switch (strengthClass) {
      case 'weak': return 'Yếu';
      case 'medium': return 'Trung bình';
      case 'strong': return 'Mạnh';
      default: return '';
    }
  }
}
