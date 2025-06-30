import { Component, OnInit, HostListener } from '@angular/core';
import { ExamScheduleVm } from '../../../Models/exam-schedule-vm';
import { ExamScheduleService } from '../../../Services/exam-schedule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examschedule-list',
  templateUrl: './examschedule-list.component.html',
  styleUrl: './examschedule-list.component.css'
})
export class ExamscheduleListComponent implements OnInit {

  public examSchedules: ExamScheduleVm[] = [];

  // Search and filtering
  searchTerm: string = '';
  filteredSchedules: ExamScheduleVm[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6; // Show fewer items since cards take more space

  // View mode
  viewMode: 'card' | 'table' = 'card';

  // Loading state
  isLoading: boolean = false;

  // Modal state
  selectedSchedule: ExamScheduleVm | null = null;

  // Header scroll state
  isHeaderScrolled = false;

  constructor(private examScheduleService: ExamScheduleService, private router: Router) { }

  ngOnInit(): void {
    this.LoadExamSchedules();
    this.updateHeaderScroll();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.updateHeaderScroll();
  }

  private updateHeaderScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const shouldBeScrolled = scrollPosition > 100;

    if (this.isHeaderScrolled !== shouldBeScrolled) {
      this.isHeaderScrolled = shouldBeScrolled;
      this.updateHeaderClass();
    }
  }

  private updateHeaderClass(): void {
    const headerElement = document.querySelector('.page-header');
    if (headerElement) {
      if (this.isHeaderScrolled) {
        headerElement.classList.add('scrolled');
      } else {
        headerElement.classList.remove('scrolled');
      }
    }
  }

  LoadExamSchedules() {
    this.isLoading = true;
    this.examScheduleService.GetExamSchedules().subscribe({
      next: (examSchedules) => {
        this.examSchedules = examSchedules;
        this.applyFilters();
        this.isLoading = false;
        console.log('Exam schedules loaded:', examSchedules);
      },
      error: (error) => {
        console.error('Error loading exam schedules:', error);
        this.isLoading = false;
      }
    });
  }

  deleteExamSchedules(id: number): void {
    const confirmDelete = confirm("Are you sure you want to delete this exam schedule?");
    if (confirmDelete) {
      this.examScheduleService.DeleteExamSchedule(id).subscribe({
        next: () => {
          this.examSchedules = this.examSchedules.filter(schedule => schedule.examScheduleId !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting exam schedule:', error);
        }
      });
    }
  }

  // Statistics methods
  getTotalSchedules(): number {
    return this.examSchedules?.length || 0;
  }

  getTotalStandards(): number {
    const uniqueStandards = new Set<string>();
    this.examSchedules?.forEach(schedule => {
      schedule.examScheduleStandards?.forEach(standard => {
        uniqueStandards.add(standard.standardName);
      });
    });
    return uniqueStandards.size;
  }

  getTotalExams(): number {
    let totalExams = 0;
    this.examSchedules?.forEach(schedule => {
      schedule.examScheduleStandards?.forEach(standard => {
        totalExams += standard.examSubjects?.length || 0;
      });
    });
    return totalExams;
  }

  getUpcomingExams(): number {
    const today = new Date();
    let upcomingCount = 0;

    this.examSchedules?.forEach(schedule => {
      schedule.examScheduleStandards?.forEach(standard => {
        standard.examSubjects?.forEach(subject => {
          const examDate = new Date(subject.examDate);
          if (examDate >= today) {
            upcomingCount++;
          }
        });
      });
    });
    return upcomingCount;
  }

  // Individual schedule statistics
  getTotalExamsForSchedule(schedule: ExamScheduleVm): number {
    let count = 0;
    schedule.examScheduleStandards?.forEach(standard => {
      count += standard.examSubjects?.length || 0;
    });
    return count;
  }

  getUniqueSubjectsCount(schedule: ExamScheduleVm): number {
    const uniqueSubjects = new Set<string>();
    schedule.examScheduleStandards?.forEach(standard => {
      standard.examSubjects?.forEach(subject => {
        uniqueSubjects.add(subject.subjectName);
      });
    });
    return uniqueSubjects.size;
  }

  getDateRange(schedule: ExamScheduleVm): string {
    const dates: Date[] = [];
    schedule.examScheduleStandards?.forEach(standard => {
      standard.examSubjects?.forEach(subject => {
        dates.push(new Date(subject.examDate));
      });
    });

    if (dates.length === 0) return 'No dates';

    dates.sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString();
    }

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  // Search and filtering
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...(this.examSchedules || [])];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(schedule =>
        schedule.examScheduleName.toLowerCase().includes(searchLower) ||
        schedule.examScheduleId.toString().includes(searchLower) ||
        schedule.examScheduleStandards?.some(standard =>
          standard.standardName.toLowerCase().includes(searchLower) ||
          standard.examSubjects?.some(subject =>
            subject.subjectName.toLowerCase().includes(searchLower) ||
            subject.examTypeName.toLowerCase().includes(searchLower)
          )
        )
      );
    }

    this.filteredSchedules = filtered;
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  getFilteredSchedules(): ExamScheduleVm[] {
    return this.filteredSchedules || [];
  }

  // Pagination methods
  getPaginatedSchedules(): ExamScheduleVm[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.getFilteredSchedules().slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredSchedules().length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  goToPageNumber(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  getPaginationStart(): number {
    if (this.getFilteredSchedules().length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationEnd(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.getFilteredSchedules().length);
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (current > 4) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 3) {
        pages.push('...');
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  // View mode
  setViewMode(mode: 'card' | 'table'): void {
    this.viewMode = mode;
    // Reset pagination when changing view mode since card and table might have different page sizes
    this.currentPage = 1;
  }

  // Modal handling
  viewScheduleDetails(schedule: ExamScheduleVm): void {
    this.selectedSchedule = schedule;
  }

  closeScheduleDetails(): void {
    this.selectedSchedule = null;
  }

  // Export functionality
  exportSchedules(): void {
    if (!this.examSchedules || this.examSchedules.length === 0) {
      return;
    }

    // Create CSV data
    const csvData = this.convertSchedulesToCSV(this.getFilteredSchedules());

    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam_schedules_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertSchedulesToCSV(schedules: ExamScheduleVm[]): string {
    const headers = [
      'Schedule ID',
      'Schedule Name',
      'Standard',
      'Subject',
      'Subject Code',
      'Exam Type',
      'Exam Date',
      'Start Time',
      'End Time'
    ];

    const rows: string[] = [headers.join(',')];

    schedules.forEach(schedule => {
      schedule.examScheduleStandards?.forEach(standard => {
        standard.examSubjects?.forEach(subject => {
          const row = [
            schedule.examScheduleId.toString(),
            `"${schedule.examScheduleName}"`,
            `"${standard.standardName}"`,
            `"${subject.subjectName}"`,
            subject.subjectCode.toString(),
            `"${subject.examTypeName}"`,
            new Date(subject.examDate).toLocaleDateString(),
            subject.examStartTime,
            subject.examEndTime
          ];
          rows.push(row.join(','));
        });
      });
    });

    return rows.join('\n');
  }

  // TrackBy functions for performance
  trackByScheduleId(index: number, schedule: ExamScheduleVm): number {
    return schedule.examScheduleId;
  }
}
