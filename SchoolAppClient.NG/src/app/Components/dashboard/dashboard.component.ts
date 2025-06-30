import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../Authentication/SecurityModels/auth.service';
import { Router } from '@angular/router';

interface RecentActivity {
  icon: string;
  title: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  private timeInterval: any;
  currentUser: any;

  // Recent activities data
  recentActivities: RecentActivity[] = [
    {
      icon: 'user-plus',
      title: 'Học sinh Nguyễn Văn An đã được đăng ký vào lớp 10A1',
      time: '5 phút trước'
    },
    {
      icon: 'money-bill-wave',
      title: 'Thanh toán học phí tháng 12 đã được xử lý thành công',
      time: '15 phút trước'
    },
    {
      icon: 'edit',
      title: 'Điểm kiểm tra Toán học lớp 12B đã được cập nhật',
      time: '1 giờ trước'
    },
    {
      icon: 'check-circle',
      title: 'Điểm danh buổi sáng lớp 11C đã hoàn thành',
      time: '2 giờ trước'
    },
    {
      icon: 'calendar-alt',
      title: 'Lịch thi cuối kỳ đã được công bố',
      time: '3 giờ trước'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get current user info
    this.currentUser = this.authService.getCurrentAuthUser;
    
    // Start real-time clock update
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);

    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    // Force change detection for real-time updates
  }

  // Get current user information
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Get current time for header display
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Get current date for header display
  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('vi-VN', options);
  }

  // Get formatted welcome message based on time of day
  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    const userName = this.currentUser?.email?.split('@')[0] || 'Người dùng';
    
    if (hour < 12) {
      return `Chào buổi sáng, ${userName}! Chúc bạn một ngày làm việc hiệu quả.`;
    } else if (hour < 18) {
      return `Chào buổi chiều, ${userName}! Hy vọng công việc của bạn đang suôn sẻ.`;
    } else {
      return `Chào buổi tối, ${userName}! Cảm ơn bạn đã dành thời gian cho hệ thống.`;
    }
  }

  // Navigation helper methods
  navigateToStudents(): void {
    this.router.navigate(['/student']);
  }

  navigateToTeachers(): void {
    this.router.navigate(['/staff-list']);
  }

  navigateToGrades(): void {
    this.router.navigate(['/marksentrynewList']);
  }

  navigateToFees(): void {
    this.router.navigate(['/fees']);
  }

  navigateToAttendance(): void {
    this.router.navigate(['/attendanceList']);
  }

  navigateToExams(): void {
    this.router.navigate(['/examSchedule']);
  }

  // Quick action handlers
  onQuickAddStudent(): void {
    this.router.navigate(['/student/create']);
  }

  onQuickAddGrade(): void {
    this.router.navigate(['/marksentrynewList']);
  }

  onQuickTakeAttendance(): void {
    this.router.navigate(['/attendanceList']);
  }

  onQuickProcessFee(): void {
    this.router.navigate(['/fees']);
  }

  onQuickAddTeacher(): void {
    this.router.navigate(['/staff-create']);
  }

  onQuickViewSchedule(): void {
    this.router.navigate(['/examSchedule']);
  }

  // Get system status for monitoring
  getSystemStatus(): string {
    // In a real application, this would check actual system health
    return 'online';
  }

  // Format large numbers with Vietnamese locale
  formatNumber(num: number): string {
    return num.toLocaleString('vi-VN');
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

  // Handle logout
  logout(): void {
    this.authService.logout();
  }
} 