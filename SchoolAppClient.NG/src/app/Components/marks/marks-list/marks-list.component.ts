import { Component, OnInit } from '@angular/core';
import { MarksService } from '../../../Services/marks.service';
import { Mark } from '../../../Models/marks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marks-list',
  templateUrl: './marks-list.component.html',
  styleUrl: './marks-list.component.css'
})
export class MarksListComponent implements OnInit {
  marks: Mark[] = [];
  filteredMarks: Mark[] = [];
  paginatedMarks: Mark[] = [];
  errorMessage = '';

  // Search and filter properties
  searchTerm = '';
  selectedGrade = '';
  selectedStatus = '';
  selectedSubject = '';

  // Advanced filter properties
  selectedScoreRange = '';
  selectedDateRange = '';
  selectedStaff = '';
  selectedSort = '';
  showAdvancedFilters = false;

  // UI state properties
  isLoading = false;
  viewMode: 'table' | 'card' | 'compact' = 'table';
  chartType: 'pie' | 'bar' = 'pie';

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Bulk actions
  selectedMarks: Mark[] = [];
  selectAll = false;

  constructor(private markService: MarksService, private router: Router) { }

  ngOnInit(): void {
    this.getAllMarks();
  }

  getAllMarks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.markService.getAllMarks().subscribe({
      next: (marks) => {
        this.marks = marks;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching marks list:', error);
        this.errorMessage = 'An error occurred while fetching the marks list. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Search functionality
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Filter functionality
  onGradeFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGrade = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSubjectFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubject = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Advanced filter methods
  onScoreRangeFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedScoreRange = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onDateRangeFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDateRange = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStaffFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStaff = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedGrade || this.selectedStatus || 
              this.selectedSubject || this.selectedScoreRange || this.selectedDateRange || 
              this.selectedStaff || this.selectedSort);
  }

  // Apply all filters
  applyFilters(): void {
    if (!this.marks || this.marks.length === 0) {
      this.filteredMarks = [];
      this.updatePagination();
      return;
    }

    this.filteredMarks = this.marks.filter(mark => {
      // Search filter
      const matchesSearch = !this.searchTerm ||
        (mark.student?.studentName && mark.student.studentName.toLowerCase().includes(this.searchTerm)) ||
        (mark.student?.enrollmentNo && mark.student.enrollmentNo.toString().toLowerCase().includes(this.searchTerm)) ||
        (mark.subject?.subjectName && mark.subject.subjectName.toLowerCase().includes(this.searchTerm)) ||
        (mark.staff?.staffName && mark.staff.staffName.toLowerCase().includes(this.searchTerm)) ||
        (mark.feedback && mark.feedback.toLowerCase().includes(this.searchTerm));

      // Grade filter
      const matchesGrade = !this.selectedGrade || mark.grade === this.selectedGrade;

      // Status filter
      const matchesStatus = !this.selectedStatus || mark.passStatus === this.selectedStatus;

      // Subject filter
      const matchesSubject = !this.selectedSubject || 
        (mark.subject?.subjectName && mark.subject.subjectName === this.selectedSubject);

      // Score range filter
      const matchesScoreRange = !this.selectedScoreRange || this.checkScoreRange(mark, this.selectedScoreRange);

      // Date range filter
      const matchesDateRange = !this.selectedDateRange || this.checkDateRange(mark, this.selectedDateRange);

      // Staff filter
      const matchesStaff = !this.selectedStaff || 
        (mark.staff?.staffName && mark.staff.staffName === this.selectedStaff);

      return matchesSearch && matchesGrade && matchesStatus && matchesSubject && 
             matchesScoreRange && matchesDateRange && matchesStaff;
    });

    // Apply sorting
    if (this.selectedSort) {
      this.applySorting();
    }

    this.updatePagination();
  }

  private checkScoreRange(mark: Mark, range: string): boolean {
    const percentage = this.getScorePercentage(mark);
    switch (range) {
      case '90-100': return percentage >= 90;
      case '80-89': return percentage >= 80 && percentage < 90;
      case '70-79': return percentage >= 70 && percentage < 80;
      case '60-69': return percentage >= 60 && percentage < 70;
      case '50-59': return percentage >= 50 && percentage < 60;
      case '0-49': return percentage < 50;
      default: return true;
    }
  }

  private checkDateRange(mark: Mark, range: string): boolean {
    const markDate = new Date(mark.markEntryDate);
    const now = new Date();
    
    switch (range) {
      case 'today':
        return markDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return markDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return markDate >= monthAgo;
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return markDate >= quarterAgo;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return markDate >= yearAgo;
      default:
        return true;
    }
  }

  private applySorting(): void {
    switch (this.selectedSort) {
      case 'student-asc':
        this.filteredMarks.sort((a, b) => (a.student?.studentName || '').localeCompare(b.student?.studentName || ''));
        break;
      case 'student-desc':
        this.filteredMarks.sort((a, b) => (b.student?.studentName || '').localeCompare(a.student?.studentName || ''));
        break;
      case 'score-asc':
        this.filteredMarks.sort((a, b) => this.getScorePercentage(a) - this.getScorePercentage(b));
        break;
      case 'score-desc':
        this.filteredMarks.sort((a, b) => this.getScorePercentage(b) - this.getScorePercentage(a));
        break;
      case 'date-asc':
        this.filteredMarks.sort((a, b) => new Date(a.markEntryDate).getTime() - new Date(b.markEntryDate).getTime());
        break;
      case 'date-desc':
        this.filteredMarks.sort((a, b) => new Date(b.markEntryDate).getTime() - new Date(a.markEntryDate).getTime());
        break;
      case 'subject-asc':
        this.filteredMarks.sort((a, b) => (a.subject?.subjectName || '').localeCompare(b.subject?.subjectName || ''));
        break;
    }
  }

  // Clear all filters
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedGrade = '';
    this.selectedStatus = '';
    this.selectedSubject = '';
    this.selectedScoreRange = '';
    this.selectedDateRange = '';
    this.selectedStaff = '';
    this.selectedSort = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination functionality
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMarks.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMarks = this.filteredMarks.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // View mode functionality
  setViewMode(mode: 'table' | 'card' | 'compact'): void {
    this.viewMode = mode;
  }

  toggleChartType(): void {
    this.chartType = this.chartType === 'pie' ? 'bar' : 'pie';
  }

  // Enhanced Statistics methods
  getPassedCount(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return this.filteredMarks.filter(mark => mark.passStatus === 'Passed').length;
  }

  getFailedCount(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return this.filteredMarks.filter(mark => mark.passStatus === 'Failed').length;
  }

  getPassedPercentage(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return Math.round((this.getPassedCount() / this.filteredMarks.length) * 100);
  }

  getFailedPercentage(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return Math.round((this.getFailedCount() / this.filteredMarks.length) * 100);
  }

  getAverageScore(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    
    const totalPercentage = this.filteredMarks.reduce((sum, mark) => {
      const percentage = mark.totalMarks > 0 ? (mark.obtainedScore / mark.totalMarks) * 100 : 0;
      return sum + percentage;
    }, 0);
    
    return Math.round(totalPercentage / this.filteredMarks.length);
  }

  getAverageGrade(): string {
    const avgScore = this.getAverageScore();
    if (avgScore >= 90) return 'A';
    if (avgScore >= 80) return 'B';
    if (avgScore >= 70) return 'C';
    if (avgScore >= 60) return 'D';
    if (avgScore >= 50) return 'E';
    return 'F';
  }

  getTopPerformersCount(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return this.filteredMarks.filter(mark => mark.grade === 'A').length;
  }

  getTopPerformersPercentage(): number {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return 0;
    return Math.round((this.getTopPerformersCount() / this.filteredMarks.length) * 100);
  }

  getTotalChangePercent(): number {
    // Mock implementation - would need historical data
    return Math.floor(Math.random() * 15) + 1;
  }

  getGradeDistribution(): any[] {
    if (!this.filteredMarks || this.filteredMarks.length === 0) return [];
    
    const distribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    
    this.filteredMarks.forEach(mark => {
      if (distribution.hasOwnProperty(mark.grade)) {
        distribution[mark.grade as keyof typeof distribution]++;
      }
    });
    
    return Object.entries(distribution).map(([grade, count]) => ({
      grade,
      count,
      percentage: Math.round((count / this.filteredMarks.length) * 100)
    }));
  }

  // Helper methods
  getScorePercentage(mark: Mark): number {
    if (!mark || mark.totalMarks === 0) return 0;
    return Math.round((mark.obtainedScore / mark.totalMarks) * 100);
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Passed':
        return 'check_circle';
      case 'Failed':
        return 'cancel';
      case 'UnderConsideration':
        return 'hourglass_empty';
      case 'SpecialConsideration':
        return 'star';
      case 'Withdrawn':
        return 'remove_circle';
      case 'UnderJurisdiction':
        return 'gavel';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'UnderConsideration':
        return 'Under Consideration';
      case 'SpecialConsideration':
        return 'Special Consideration';
      case 'UnderJurisdiction':
        return 'Under Jurisdiction';
      default:
        return status;
    }
  }

  getUniqueSubjects(): string[] {
    if (!this.marks || this.marks.length === 0) return [];
    
    const subjects = this.marks
      .map(mark => mark.subject?.subjectName)
      .filter((subject, index, array) => subject && array.indexOf(subject) === index)
      .sort();
    
    return subjects as string[];
  }

  getUniqueStaff(): string[] {
    if (!this.marks || this.marks.length === 0) return [];
    
    const staff = this.marks
      .map(mark => mark.staff?.staffName)
      .filter((staff, index, array) => staff && array.indexOf(staff) === index)
      .sort();
    
    return staff as string[];
  }

  getUniqueStudents(): string[] {
    if (!this.marks || this.marks.length === 0) return [];
    
    const students = this.marks
      .map(mark => mark.student?.studentName)
      .filter((student, index, array) => student && array.indexOf(student) === index)
      .sort();
    
    return students as string[];
  }

  // Bulk Actions
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedMarks = [...this.paginatedMarks];
    } else {
      this.selectedMarks = [];
    }
  }

  toggleSelectMark(mark: Mark): void {
    const index = this.selectedMarks.findIndex(m => m.markId === mark.markId);
    if (index > -1) {
      this.selectedMarks.splice(index, 1);
    } else {
      this.selectedMarks.push(mark);
    }
    this.selectAll = this.selectedMarks.length === this.paginatedMarks.length;
  }

  isMarkSelected(mark: Mark): boolean {
    return this.selectedMarks.some(m => m.markId === mark.markId);
  }

  clearSelection(): void {
    this.selectedMarks = [];
    this.selectAll = false;
  }

  bulkExport(): void {
    console.log('Bulk export:', this.selectedMarks);
    // Implement bulk export functionality
  }

  bulkEdit(): void {
    console.log('Bulk edit:', this.selectedMarks);
    // Implement bulk edit functionality
  }

  bulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedMarks.length} selected records?`)) {
      console.log('Bulk delete:', this.selectedMarks);
      // Implement bulk delete functionality
      this.clearSelection();
    }
  }

  // Action methods
  viewMarkDetails(mark: Mark): void {
    console.log('View mark details:', mark);
    // You can implement navigation to a details page or show modal here
    // this.router.navigate(['/marks', mark.markId, 'details']);
  }

  deleteMark(markId: number): void {
    if (confirm('Are you sure you want to delete this mark record?')) {
      this.markService.deleteMark(markId).subscribe({
        next: () => {
          this.marks = this.marks.filter(mark => mark.markId !== markId);
          this.applyFilters();
          console.log('Mark deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting mark:', error);
          this.errorMessage = 'Error deleting mark. Please try again.';
        }
      });
    }
  }

  // Utility methods
  refreshData(): void {
    this.getAllMarks();
  }

  exportData(): void {
    console.log('Export functionality to be implemented');
    // Implement export functionality
    // You can export to CSV, Excel, or PDF
  }

  generateReport(): void {
    console.log('Generate report functionality to be implemented');
    // Implement report generation
    // You can generate academic performance reports
  }

  // Math helper for template
  Math = Math;
}



//export class MarksListComponent implements OnInit {
//  marks: Mark[] = [];
  
//  constructor(private markService: MarksService, private router: Router) { }

//  ngOnInit(): void {
//    this.getAllMarks();
//  }

//  getAllMarks(): void {
//    this.markService.getAllMarks()
//      .subscribe({
//        next: (marks: Mark[]) => {
//          this.marks = marks;
//        },
//        error: (error) => {
//          console.error('#Developer# Error fetching marks:', error);
//        }
//      });
//  }

//  editMark(markId: number): void {
//    this.router.navigate(['/marks/edit', markId]);
//  }

//  deleteMark(markId: number): void {
//    if (confirm('Are you sure you want to delete this mark?')) {
//      this.markService.deleteMark(markId).subscribe(() => {
//        // Delete successful, update the marks list
//        this.getAllMarks();
//      }, error => {
//        console.error('Error deleting mark:', error);
//      });
//    }
//  }


//}
