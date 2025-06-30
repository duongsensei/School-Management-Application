export class AuthRegRequest {
  public email = '';
  public username = '';  // Changed from userName to username to match backend
  public password = '';
  public confirmPassword = '';
  public role: string[] = ['Student']; // Default role

  // Validation methods
  isEmailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.email);
  }

  isUsernameValid(): boolean {
    const usernamePattern = /^[a-zA-Z0-9_]{3,50}$/;
    return usernamePattern.test(this.username);
  }

  isPasswordValid(): boolean {
    if (this.password.length < 8) return false;
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(this.password)) return false;
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(this.password)) return false;
    
    // Check for at least one digit
    if (!/\d/.test(this.password)) return false;
    
    // Check for at least one special character
    if (!/[@$!%*?&#+\-_]/.test(this.password)) return false;
    
    return true;
  }

  doPasswordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  getPasswordStrengthMessage(): string {
    if (this.password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/[A-Z]/.test(this.password)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    if (!/[a-z]/.test(this.password)) return 'Mật khẩu phải có ít nhất 1 chữ thường';
    if (!/\d/.test(this.password)) return 'Mật khẩu phải có ít nhất 1 số';
    if (!/[@$!%*?&#+\-_]/.test(this.password)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@$!%*?&#+\-_)';
    return '';
  }
}
