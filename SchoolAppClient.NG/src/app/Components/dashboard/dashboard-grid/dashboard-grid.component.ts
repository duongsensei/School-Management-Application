import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from '../../../Services/student.service';
import { StandardService } from '../../../Services/standard.service';
import { StaffService } from '../../../Services/staff.service';
import { DepartmentServices } from '../../../Services/department.service';

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-grid',
  templateUrl: './dashboard-grid.component.html',
  styleUrl: './dashboard-grid.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Data properties
  studentCount = 0;
  staffCount = 0;
  departmentCount = 0;
  standardCount = 0;

  // Slide properties
  currentSlide = 0;
  progressWidth = 0;
  autoPlayInterval: any;
  progressInterval: any;
  autoPlayDuration = 8000; // 8 seconds per slide

  slides: Slide[] = [
    {
      id: 1,
      title: 'Welcome to Our School Management System',
      description: 'A comprehensive digital solution designed to streamline educational administration.',
      icon: 'school'
    },
    {
      id: 2,
      title: 'Comprehensive Student Management',
      description: 'Manage student records, track academic progress, and monitor attendance.',
      icon: 'people'
    },
    {
      id: 3,
      title: 'Smart Academic Analytics',
      description: 'Leverage data-driven insights to improve educational outcomes.',
      icon: 'psychology'
    },
    {
      id: 4,
      title: 'Secure & Reliable Platform',
      description: 'Built with enterprise-grade security and reliable access.',
      icon: 'security'
    }
  ];

  constructor(
    private studentService: StudentService,
    private staffService: StaffService,
    private departmentService: DepartmentServices,
    private standardService: StandardService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // Data loading methods
  private loadData(): void {
    this.getStudentCount();
    this.getStaffCount();
    this.getDepartmentCount();
    this.getStandardCount();
  }

  getStudentCount(): void {
    this.studentService.GetStudents().subscribe({
      next: (students) => {
        this.studentCount = students.length;
      },
      error: (error) => {
        console.error('Error loading student count:', error);
        this.studentCount = 0;
      }
    });
  }

  getStaffCount(): void {
    this.staffService.getAllStaffs().subscribe({
      next: (staffs) => {
        this.staffCount = staffs.length;
      },
      error: (error) => {
        console.error('Error loading staff count:', error);
        this.staffCount = 0;
      }
    });
  }

  getDepartmentCount(): void {
    this.departmentService.getAllDepartment().subscribe({
      next: (departments) => {
        this.departmentCount = departments.length;
      },
      error: (error) => {
        console.error('Error loading department count:', error);
        this.departmentCount = 0;
      }
    });
  }

  getStandardCount(): void {
    this.standardService.getStandards().subscribe({
      next: (standards) => {
        this.standardCount = standards.length;
      },
      error: (error) => {
        console.error('Error loading standard count:', error);
        this.standardCount = 0;
      }
    });
  }

  // Slide navigation methods
  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.resetProgress();
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.resetProgress();
    }
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.resetProgress();
    }
  }

  // Auto-play functionality
  private startAutoPlay(): void {
    this.startProgressBar();

    this.autoPlayInterval = setInterval(() => {
      if (this.currentSlide < this.slides.length - 1) {
        this.nextSlide();
      } else {
        this.currentSlide = 0;
        this.resetProgress();
      }
    }, this.autoPlayDuration);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private startProgressBar(): void {
    this.progressWidth = 0;
    const increment = 100 / (this.autoPlayDuration / 100); // Update every 100ms

    this.progressInterval = setInterval(() => {
      this.progressWidth += increment;
      if (this.progressWidth >= 100) {
        this.progressWidth = 100;
      }
    }, 100);
  }

  private resetProgress(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  // Utility methods
  getCurrentTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleTimeString('en-US', options);
  }

  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  }

  // Performance and analytics methods
  getSystemHealth(): string {
    // In a real application, this would check actual system metrics
    const health = Math.random();
    if (health > 0.8) return 'Excellent';
    if (health > 0.6) return 'Good';
    if (health > 0.4) return 'Fair';
    return 'Poor';
  }

  getAttendanceRate(): number {
    // In a real application, this would calculate actual attendance
    return Math.floor(Math.random() * (98 - 85 + 1)) + 85; // Random between 85-98%
  }

  getActiveSessionsCount(): number {
    // In a real application, this would get actual active sessions
    return Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Random between 10-50
  }

  // Format number with commas
  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  // Handle card interactions
  onCardHover(cardType: string): void {
    // Optional: Add analytics tracking for card interactions
    console.log(`User hovered over ${cardType} card`);
  }

  onQuickActionClick(action: string): void {
    // Optional: Add analytics tracking for quick actions
    console.log(`User clicked ${action} quick action`);
  }
}
