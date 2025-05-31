import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { StaffSalary } from '../../../Models/staff-salary';
import { StaffSalaryService } from '../../../Services/staff-salary.service';

@Component({
  selector: 'app-staff-salary-list',
  templateUrl: './staff-salary-list.component.html',
  styleUrl: './staff-salary-list.component.css'
})
export class StaffSalaryListComponent implements OnInit, OnDestroy {

  // Data properties
  staffSalaries: StaffSalary[] = [];
  filteredSalaries: StaffSalary[] = [];
  paginatedSalaries: StaffSalary[] = [];
  selectedSalaries: StaffSalary[] = [];

  // Loading state
  loading = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Statistics
  totalStaffCount = 0;
  totalPayroll = 0;
  averageSalary = 0;
  totalDeductions = 0;

  // Filter and search properties
  searchTerm = '';
  salaryRangeFilter = '';
  sortBy = 'name';
  showAdvancedFilters = false;
  minBasicSalary: number | null = null;
  maxBasicSalary: number | null = null;
  hasAllowancesFilter = '';

  // Pagination properties
  currentPage = 1;
  pageSize = 25;
  totalPages = 1;

  // View properties
  currentView: 'table' | 'cards' = 'table';

  // Delete confirmation
  showDeleteConfirmation = false;
  salaryToDelete: StaffSalary | null = null;

  constructor(private staffSalaryService: StaffSalaryService) { }

  ngOnInit(): void {
    this.loadStaffSalaries();
    this.updateHeaderScroll();
  }

  ngOnDestroy(): void {
    // Clean up if needed
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

  loadStaffSalaries(): void {
    this.loading = true;
    this.staffSalaryService.getStaffSalaries()
      .subscribe({
        next: (data: StaffSalary[]) => {
        this.staffSalaries = data;
          this.calculateStatistics();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading staff salaries:', error);
          this.loading = false;
        }
      });
  }

  calculateStatistics(): void {
    this.totalStaffCount = this.staffSalaries.length;
    this.totalPayroll = this.staffSalaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0);
    this.averageSalary = this.totalStaffCount > 0 ? this.totalPayroll / this.totalStaffCount : 0;
    this.totalDeductions = this.staffSalaries.reduce((sum, salary) =>
      sum + (salary.savingFund || 0) + (salary.taxes || 0), 0);
  }

  // Filter and search methods
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  applyFilters(): void {
    let filtered = [...this.staffSalaries];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(salary =>
        salary.staffName?.toLowerCase().includes(term)
      );
    }

    // Apply salary range filter
    if (this.salaryRangeFilter) {
      filtered = filtered.filter(salary => {
        const netSalary = salary.netSalary || 0;
        switch (this.salaryRangeFilter) {
          case 'low': return netSalary <= 50000;
          case 'medium': return netSalary > 50000 && netSalary <= 100000;
          case 'high': return netSalary > 100000;
          default: return true;
        }
      });
    }

    // Apply basic salary range filter
    if (this.minBasicSalary !== null) {
      filtered = filtered.filter(salary => (salary.basicSalary || 0) >= this.minBasicSalary!);
    }
    if (this.maxBasicSalary !== null) {
      filtered = filtered.filter(salary => (salary.basicSalary || 0) <= this.maxBasicSalary!);
    }

    // Apply allowances filter
    if (this.hasAllowancesFilter) {
      filtered = filtered.filter(salary => {
        const hasAllowances = this.getTotalAllowances(salary) > 0;
        return this.hasAllowancesFilter === 'yes' ? hasAllowances : !hasAllowances;
      });
    }

    this.filteredSalaries = filtered;
    this.applySorting();
    this.updatePagination();
  }

  applySorting(): void {
    this.filteredSalaries.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return (a.staffName || '').localeCompare(b.staffName || '');
        case 'salary-high':
          return (b.basicSalary || 0) - (a.basicSalary || 0);
        case 'salary-low':
          return (a.basicSalary || 0) - (b.basicSalary || 0);
        case 'net-salary':
          return (b.netSalary || 0) - (a.netSalary || 0);
        default:
          return 0;
      }
    });
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.salaryRangeFilter = '';
    this.minBasicSalary = null;
    this.maxBasicSalary = null;
    this.hasAllowancesFilter = '';
    this.sortBy = 'name';
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSalaries.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSalaries = this.filteredSalaries.slice(startIndex, endIndex);
  }

  updatePageSize(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredSalaries.length);
  }

  // View methods
  setView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  // Selection methods
  isSelected(salary: StaffSalary): boolean {
    return this.selectedSalaries.some(s => s.staffSalaryId === salary.staffSalaryId);
  }

  toggleSelection(salary: StaffSalary): void {
    if (this.isSelected(salary)) {
      this.selectedSalaries = this.selectedSalaries.filter(s => s.staffSalaryId !== salary.staffSalaryId);
    } else {
      this.selectedSalaries.push(salary);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedSalaries.length > 0 &&
      this.paginatedSalaries.every(salary => this.isSelected(salary));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedSalaries = this.selectedSalaries.filter(selected =>
        !this.paginatedSalaries.some(paginated => paginated.staffSalaryId === selected.staffSalaryId)
      );
    } else {
      this.paginatedSalaries.forEach(salary => {
        if (!this.isSelected(salary)) {
          this.selectedSalaries.push(salary);
        }
      });
    }
  }

  clearSelection(): void {
    this.selectedSalaries = [];
  }

  // Utility methods
  getTotalAllowances(salary: StaffSalary): number {
    return (salary.festivalBonus || 0) +
      (salary.allowance || 0) +
      (salary.medicalAllowance || 0) +
      (salary.housingAllowance || 0) +
      (salary.transportationAllowance || 0);
  }

  getTotalDeductions(salary: StaffSalary): number {
    return (salary.savingFund || 0) + (salary.taxes || 0);
  }

  // Action methods
  viewSalaryDetails(salary: StaffSalary): void {
    // Open salary details modal or navigate to details page
    console.log('View salary details for:', salary.staffName);
    // TODO: Implement salary details view
  }

  deleteSalary(salary: StaffSalary): void {
    this.salaryToDelete = salary;
    this.showDeleteConfirmation = true;
  }

  confirmDelete(): void {
    if (this.salaryToDelete) {
      this.staffSalaryService.deleteStaffSalary(this.salaryToDelete.staffSalaryId)
        .subscribe({
          next: () => {
            this.staffSalaries = this.staffSalaries.filter(s =>
              s.staffSalaryId !== this.salaryToDelete!.staffSalaryId
            );
            this.calculateStatistics();
            this.applyFilters();
            this.cancelDelete();
          },
          error: (error) => {
            console.error('Error deleting salary:', error);
            this.cancelDelete();
          }
        });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.salaryToDelete = null;
  }

  // Bulk operations
  bulkEdit(): void {
    console.log('Bulk edit salaries:', this.selectedSalaries);
    // TODO: Implement bulk edit functionality
  }

  bulkDelete(): void {
    if (this.selectedSalaries.length > 0) {
      const confirmMessage = `Are you sure you want to delete ${this.selectedSalaries.length} salary records?`;
      if (confirm(confirmMessage)) {
        // TODO: Implement bulk delete functionality
        console.log('Bulk delete salaries:', this.selectedSalaries);
      }
    }
  }

  // Export functionality
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredSalaries);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff-salaries-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: StaffSalary[]): string {
    const headers = ['Staff Name', 'Basic Salary', 'Festival Bonus', 'Allowance',
      'Medical Allowance', 'Housing Allowance', 'Transportation Allowance',
      'Saving Fund', 'Taxes', 'Net Salary'];

    const csvContent = [
      headers.join(','),
      ...data.map(salary => [
        salary.staffName,
        salary.basicSalary,
        salary.festivalBonus,
        salary.allowance,
        salary.medicalAllowance,
        salary.housingAllowance,
        salary.transportationAllowance,
        salary.savingFund,
        salary.taxes,
        salary.netSalary
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}
