import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../SecurityModels/auth.service';
import { Router } from '@angular/router';

interface PersonalInfo {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
}

interface Preferences {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

interface RecentActivity {
  type: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  device: string;
  location: string;
}

interface UserStat {
  icon: string;
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any;
  lastPasswordChange = '15/11/2023';

  // Personal information
  personalInfo: PersonalInfo = {
    fullName: 'Nguyễn Văn A',
    phone: '0123 456 789',
    birthDate: '15/01/1990',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM'
  };

  // User preferences
  preferences: Preferences = {
    emailNotifications: true,
    darkMode: false,
    language: 'vi'
  };

  // Recent activities
  recentActivities: RecentActivity[] = [
    {
      type: 'login',
      icon: 'sign-in-alt',
      title: 'Đăng nhập thành công',
      description: 'Đăng nhập vào hệ thống quản lý trường học',
      time: '5 phút trước',
      device: 'desktop',
      location: 'Windows 10'
    },
    {
      type: 'update',
      icon: 'edit',
      title: 'Cập nhật thông tin',
      description: 'Thay đổi thông tin cá nhân',
      time: '2 giờ trước',
      device: 'desktop',
      location: 'Windows 10'
    },
    {
      type: 'security',
      icon: 'shield-alt',
      title: 'Đổi mật khẩu',
      description: 'Cập nhật mật khẩu bảo mật',
      time: '1 ngày trước',
      device: 'mobile',
      location: 'Android'
    },
    {
      type: 'login',
      icon: 'sign-in-alt',
      title: 'Đăng nhập từ thiết bị mới',
      description: 'Đăng nhập từ điện thoại di động',
      time: '3 ngày trước',
      device: 'mobile',
      location: 'iPhone iOS'
    },
    {
      type: 'logout',
      icon: 'sign-out-alt',
      title: 'Đăng xuất',
      description: 'Đăng xuất khỏi hệ thống',
      time: '5 ngày trước',
      device: 'desktop',
      location: 'Windows 10'
    }
  ];

  // User statistics
  userStats: UserStat[] = [
    {
      icon: 'calendar-check',
      value: '24',
      label: 'Ngày hoạt động',
      color: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
    },
    {
      icon: 'tasks',
      value: '18',
      label: 'Tác vụ hoàn thành',
      color: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      icon: 'clock',
      value: '156h',
      label: 'Thời gian online',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      icon: 'trophy',
      value: '4.8/5',
      label: 'Đánh giá hiệu suất',
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get current user info
    this.currentUser = this.authService.getCurrentAuthUser;
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    // Load user data
    this.loadPersonalInfo();
    this.loadPreferences();
  }

  // Get current user information
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Get user role display name
  getUserRoleDisplay(): string {
    if (!this.currentUser || !this.currentUser.roles) return 'Người dùng';
    
    const roleMap: {[key: string]: string} = {
      'Admin': 'Quản trị viên',
      'Manager': 'Quản lý',
      'Teacher': 'Giáo viên',
      'Student': 'Học sinh',
      'Operator': 'Điều hành viên'
    };

    const primaryRole = this.currentUser.roles[0];
    return roleMap[primaryRole] || primaryRole;
  }

  // Get role CSS class
  getRoleClass(): string {
    if (!this.currentUser || !this.currentUser.roles) return '';
    
    const role = this.currentUser.roles[0].toLowerCase();
    return role;
  }

  // Get role icon
  getRoleIcon(): string {
    if (!this.currentUser || !this.currentUser.roles) return 'fas fa-user';
    
    const roleIcons: {[key: string]: string} = {
      'Admin': 'fas fa-crown',
      'Manager': 'fas fa-user-tie',
      'Teacher': 'fas fa-chalkboard-teacher',
      'Student': 'fas fa-user-graduate',
      'Operator': 'fas fa-cogs'
    };

    const primaryRole = this.currentUser.roles[0];
    return roleIcons[primaryRole] || 'fas fa-user';
  }

  // Load personal information
  private loadPersonalInfo(): void {
    // In a real application, this would fetch data from a service
    // For now, we use mock data
  }

  // Load user preferences
  private loadPreferences(): void {
    // In a real application, this would fetch user preferences
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
    }
  }

  // Save preferences
  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  // Event handlers
  onEditAvatar(): void {
    // TODO: Implement avatar upload functionality
    console.log('Edit avatar clicked');
  }

  onEditProfile(): void {
    // TODO: Navigate to edit profile page or open modal
    console.log('Edit profile clicked');
  }

  onChangePassword(): void {
    // TODO: Navigate to change password page or open modal
    console.log('Change password clicked');
  }

  onEditPersonalInfo(): void {
    // TODO: Open edit personal info modal or navigate to edit page
    console.log('Edit personal info clicked');
  }

  onSetup2FA(): void {
    // TODO: Navigate to 2FA setup page
    console.log('Setup 2FA clicked');
  }

  // Update preferences
  onPreferenceChange(): void {
    this.savePreferences();
    
    // Apply dark mode if enabled
    if (this.preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Handle language change
    if (this.preferences.language === 'en') {
      // TODO: Switch to English
      console.log('Switch to English');
    }
  }

  // Get formatted date
  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('vi-VN', options);
  }

  // Check user role for conditional display
  hasRole(role: string): boolean {
    if (!this.currentUser || !this.currentUser.roles) return false;
    return this.currentUser.roles.includes(role);
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('Admin') || this.hasRole('Manager');
  }

  // Check if user is teacher
  isTeacher(): boolean {
    return this.hasRole('Teacher');
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole('Student');
  }

  // Navigation helpers
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
  }

  // Mock data update methods (for demonstration)
  updatePersonalInfo(field: string, value: string): void {
    (this.personalInfo as any)[field] = value;
    // TODO: Save to backend
    console.log(`Updated ${field} to ${value}`);
  }

  // Security actions
  enableTwoFactor(): void {
    // TODO: Implement 2FA enable
    console.log('Enable 2FA');
  }

  changePasswordAction(): void {
    // TODO: Implement password change
    console.log('Change password');
  }

  // Activity filtering
  filterActivities(period: string): void {
    // TODO: Filter activities by time period
    console.log(`Filter activities: ${period}`);
  }

  // Export user data
  exportUserData(): void {
    const userData = {
      user: this.currentUser,
      personalInfo: this.personalInfo,
      preferences: this.preferences,
      stats: this.userStats
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-profile-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }
} 