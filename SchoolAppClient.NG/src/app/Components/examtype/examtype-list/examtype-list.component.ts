import { Component, OnInit, HostListener } from '@angular/core';
import { Examtype } from '../../../Models/examtype';
import { ExamtypeService } from '../../../Services/examtype.service';

@Component({
  selector: 'app-examtype-list',
  templateUrl: './examtype-list.component.html',
  styleUrl: './examtype-list.component.css'
})
export class ExamtypeListComponent implements OnInit {
  public examtypes: Examtype[] = [];

  // Search and filtering
  searchTerm: string = '';
  filteredExamTypes: Examtype[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedExamTypeIds: Set<number> = new Set();

  // Loading state
  isLoading: boolean = false;

  // Header scroll state
  isHeaderScrolled = false;

  constructor(private examTypeService: ExamtypeService) { }

  ngOnInit(): void {
    this.LoadData();
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

  LoadData() {
    this.isLoading = true;
    this.examTypeService.GetdbsExamType().subscribe({
      next: (data: Examtype[]) => {
        this.examtypes = data;
        this.applyFilters();
        this.isLoading = false;
        console.log(data);
      },
      error: (error) => {
        console.log('Observable emitted an error: ' + error);
        this.isLoading = false;
      }
    });
  }

  DeleteExamType(examType: Examtype) {
    const confirmDelete: boolean = confirm(`Delete ${examType.examTypeName}?`);
    if (confirmDelete) {
      this.examTypeService.DeleteExamType(examType.examTypeId).subscribe({
        next: () => {
          this.LoadData();
          // Remove from selection if it was selected
          this.selectedExamTypeIds.delete(examType.examTypeId);
        },
        error: (error) => {
          console.log('Observable emitted an error: ' + error);
        }
      });
    }
  }

  // Statistics methods
  getTotalExamTypes(): number {
    return this.examtypes?.length || 0;
  }

  getFilteredExamTypes(): Examtype[] {
    return this.filteredExamTypes || [];
  }

  getSelectedCount(): number {
    return this.selectedExamTypeIds.size;
  }

  getRecentlyAddedCount(): number {
    // Since we don't have creation date, we'll simulate this
    // In a real app, you'd filter by creation date
    return Math.min(this.examtypes?.length || 0, 3);
  }

  // Search and filtering
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...(this.examtypes || [])];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(examType =>
        examType.examTypeName.toLowerCase().includes(searchLower) ||
        examType.examTypeId.toString().includes(searchLower)
      );
    }

    this.filteredExamTypes = filtered;
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.selectedExamTypeIds.clear();
    this.applyFilters();
  }

  // Pagination methods
  getPaginatedExamTypes(): Examtype[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.getFilteredExamTypes().slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredExamTypes().length / this.pageSize);
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
    if (this.getFilteredExamTypes().length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationEnd(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.getFilteredExamTypes().length);
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

  // Selection methods
  toggleSelectAll(): void {
    const currentPageIds = this.getPaginatedExamTypes().map(et => et.examTypeId);

    if (this.isAllSelected()) {
      // Deselect all on current page
      currentPageIds.forEach(id => this.selectedExamTypeIds.delete(id));
    } else {
      // Select all on current page
      currentPageIds.forEach(id => this.selectedExamTypeIds.add(id));
    }
  }

  toggleSelectExamType(examTypeId: number): void {
    if (this.selectedExamTypeIds.has(examTypeId)) {
      this.selectedExamTypeIds.delete(examTypeId);
    } else {
      this.selectedExamTypeIds.add(examTypeId);
    }
  }

  isSelected(examTypeId: number): boolean {
    return this.selectedExamTypeIds.has(examTypeId);
  }

  isAllSelected(): boolean {
    const currentPageIds = this.getPaginatedExamTypes().map(et => et.examTypeId);
    return currentPageIds.length > 0 && currentPageIds.every(id => this.selectedExamTypeIds.has(id));
  }

  isIndeterminate(): boolean {
    const currentPageIds = this.getPaginatedExamTypes().map(et => et.examTypeId);
    const selectedOnPage = currentPageIds.filter(id => this.selectedExamTypeIds.has(id));
    return selectedOnPage.length > 0 && selectedOnPage.length < currentPageIds.length;
  }

  hasSelectedItems(): boolean {
    return this.selectedExamTypeIds.size > 0;
  }

  // Bulk operations
  bulkDelete(): void {
    if (this.selectedExamTypeIds.size === 0) return;

    const selectedExamTypes = this.examtypes.filter(et => this.selectedExamTypeIds.has(et.examTypeId));
    const examTypeNames = selectedExamTypes.map(et => et.examTypeName).join(', ');

    const confirmDelete = confirm(`Are you sure you want to delete the following exam types?\n\n${examTypeNames}`);

    if (confirmDelete) {
      // In a real application, you'd have a bulk delete API endpoint
      // For now, we'll delete one by one
      let deletedCount = 0;
      const totalToDelete = this.selectedExamTypeIds.size;

      selectedExamTypes.forEach(examType => {
        this.examTypeService.DeleteExamType(examType.examTypeId).subscribe({
          next: () => {
            deletedCount++;
            if (deletedCount === totalToDelete) {
              this.selectedExamTypeIds.clear();
              this.LoadData();
            }
          },
          error: (error) => {
            console.log('Error deleting exam type:', error);
          }
        });
      });
    }
  }

  // Export functionality
  exportExamTypes(): void {
    const dataToExport = this.getFilteredExamTypes().map(examType => ({
      'ID': examType.examTypeId,
      'Exam Type Name': examType.examTypeName,
      'Status': 'Active'
    }));

    const csvContent = this.convertToCSV(dataToExport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `exam-types-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  }

  // Utility methods
  trackByExamTypeId(index: number, examType: Examtype): number {
    return examType.examTypeId;
  }

  getFormattedDate(examType: Examtype): string {
    // Since the model doesn't have a creation date, we'll show a placeholder
    // In a real application, you'd format the actual date
    return 'N/A';
  }
}

