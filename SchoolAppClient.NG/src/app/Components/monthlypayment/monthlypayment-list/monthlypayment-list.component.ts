import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MonthlyPayment } from '../../../Models/monthly-payment';
import { MonthlyPaymentService } from '../../../Services/monthly-payment.service';
import { Router } from '@angular/router';
import { PageSettingsModel, FilterSettingsModel, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-monthlypayment-list',
  templateUrl: './monthlypayment-list.component.html',
  styleUrl: './monthlypayment-list.component.css'
})
export class MonthlypaymentListComponent implements OnInit, OnDestroy {

  // Data properties
  monthlyPayments: MonthlyPayment[] = [];
  filteredPayments: MonthlyPayment[] = [];
  paginatedPayments: MonthlyPayment[] = [];
  selectedPayments: MonthlyPayment[] = [];

  // Loading state
  loading = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Statistics
  totalPayments = 0;
  totalAmountPaid = 0;
  totalAmountRemaining = 0;

  // Filter and search properties
  searchTerm = '';
  sortBy = 'date-desc';
  statusFilter = '';
  amountFilter = '';
  showAdvancedFilters = false;

  // Pagination properties
  currentPage = 1;
  pageSize = 25;
  totalPages = 1;

  // View properties
  currentView: 'table' | 'cards' = 'table';

  // Confirmation dialog
  confirmationDialogVisible = false;
  monthlyPaymentIdToDelete: number | undefined;

  // Legacy properties for backward compatibility
  searchPaymentId = '';

  pageSettings: PageSettingsModel = { pageSize: 5 };
  filterSettings: FilterSettingsModel = { type: 'Menu' };
  searchSettings: SearchSettingsModel = {
    fields: ['student.studentName', 'monthlyPaymentId', 'student.enrollmentNo'],
    operator: 'contains',
    ignoreCase: true
  };

  constructor(private monthlyPaymentService: MonthlyPaymentService, private router: Router) { }

  ngOnInit(): void {
    this.loadMonthlyPayments();
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

  loadMonthlyPayments(): void {
    this.loading = true;
    this.monthlyPaymentService.getAllMonthlyPayments().subscribe({
      next: (data: MonthlyPayment[]) => {
        this.monthlyPayments = data;
        this.calculateStatistics();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading monthly payments:', error);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalPayments = this.monthlyPayments.length;
    this.totalAmountPaid = this.monthlyPayments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
    this.totalAmountRemaining = this.monthlyPayments.reduce((sum, payment) => sum + (payment.amountRemaining || 0), 0);
  }

  // Payment status classification methods
  getPaymentStatus(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'Fully Paid';
    } else if (payment.amountPaid > 0) {
      return 'Partially Paid';
    } else {
      return 'Pending';
    }
  }

  getPaymentStatusClass(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'paid';
    } else if (payment.amountPaid > 0) {
      return 'partial';
    } else {
      return 'pending';
    }
  }

  getPaymentStatusIcon(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'check_circle';
    } else if (payment.amountPaid > 0) {
      return 'hourglass_empty';
    } else {
      return 'schedule';
    }
  }

  // Statistics calculation methods
  getPaidPercentage(): number {
    const totalAmount = this.totalAmountPaid + this.totalAmountRemaining;
    return totalAmount > 0 ? (this.totalAmountPaid / totalAmount) * 100 : 0;
  }

  getRemainingPercentage(): number {
    const totalAmount = this.totalAmountPaid + this.totalAmountRemaining;
    return totalAmount > 0 ? (this.totalAmountRemaining / totalAmount) * 100 : 0;
  }

  getSelectionPercentage(): number {
    return this.totalPayments > 0 ? (this.selectedPayments.length / this.totalPayments) * 100 : 0;
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
    let filtered = [...this.monthlyPayments];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.monthlyPaymentId.toString().includes(term) ||
        (payment.student?.studentName && payment.student.studentName.toLowerCase().includes(term)) ||
        (payment.student?.enrollmentNo && payment.student.enrollmentNo.toString().toLowerCase().includes(term)) ||
        this.getPaymentStatus(payment).toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(payment => {
        const status = this.getPaymentStatusClass(payment);
        return status === this.statusFilter;
      });
    }

    // Apply amount filter
    if (this.amountFilter) {
      filtered = filtered.filter(payment => {
        const amount = payment.totalAmount || 0;
        switch (this.amountFilter) {
          case 'low':
            return amount < 500;
          case 'medium':
            return amount >= 500 && amount <= 2000;
          case 'high':
            return amount > 2000;
          default:
            return true;
        }
      });
    }

    this.filteredPayments = filtered;
    this.applySorting();
    this.updatePagination();
  }

  applySorting(): void {
    this.filteredPayments.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-asc':
          return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
        case 'date-desc':
          return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'name-asc':
          return (a.student?.studentName || '').localeCompare(b.student?.studentName || '');
        case 'name-desc':
          return (b.student?.studentName || '').localeCompare(a.student?.studentName || '');
        default:
          return 0;
      }
    });
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.amountFilter = '';
    this.sortBy = 'date-desc';
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPayments.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPayments = this.filteredPayments.slice(startIndex, endIndex);
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
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredPayments.length);
  }

  // View methods
  setView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  // Selection methods
  isSelected(payment: MonthlyPayment): boolean {
    return this.selectedPayments.some(p => p.monthlyPaymentId === payment.monthlyPaymentId);
  }

  toggleSelection(payment: MonthlyPayment): void {
    if (this.isSelected(payment)) {
      this.selectedPayments = this.selectedPayments.filter(p => p.monthlyPaymentId !== payment.monthlyPaymentId);
    } else {
      this.selectedPayments.push(payment);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedPayments.length > 0 &&
      this.paginatedPayments.every(payment => this.isSelected(payment));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedPayments = this.selectedPayments.filter(selected =>
        !this.paginatedPayments.some(paginated => paginated.monthlyPaymentId === selected.monthlyPaymentId)
      );
    } else {
      this.paginatedPayments.forEach(payment => {
        if (!this.isSelected(payment)) {
          this.selectedPayments.push(payment);
        }
      });
    }
  }

  selectAll(): void {
    this.selectedPayments = [...this.filteredPayments];
  }

  clearSelection(): void {
    this.selectedPayments = [];
  }

  // Action methods
  confirmDelete(id: number): void {
    this.confirmationDialogVisible = true;
    this.monthlyPaymentIdToDelete = id;
  }

  deleteMonthlyPayment(): void {
    if (this.monthlyPaymentIdToDelete !== undefined) {
      this.monthlyPaymentService.deleteMonthlyPayment(this.monthlyPaymentIdToDelete).subscribe({
        next: () => {
          this.monthlyPayments = this.monthlyPayments.filter(payment => payment.monthlyPaymentId !== this.monthlyPaymentIdToDelete);
          this.calculateStatistics();
          this.applyFilters();
          this.closeConfirmationDialog();
        },
        error: (error) => {
          console.error('Error deleting monthly payment:', error);
          this.closeConfirmationDialog();
        }
      });
    }
  }

  closeConfirmationDialog(): void {
    this.confirmationDialogVisible = false;
    this.monthlyPaymentIdToDelete = undefined;
  }

  // Bulk operations
  bulkEdit(): void {
    console.log('Bulk edit payments:', this.selectedPayments);
    // TODO: Implement bulk edit functionality
  }

  bulkDelete(): void {
    if (this.selectedPayments.length > 0) {
      const confirmMessage = `Are you sure you want to delete ${this.selectedPayments.length} payments?`;
      if (confirm(confirmMessage)) {
        // TODO: Implement bulk delete functionality
        console.log('Bulk delete payments:', this.selectedPayments);
      }
    }
  }

  // Export functionality
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredPayments);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly-payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: MonthlyPayment[]): string {
    const headers = ['Payment ID', 'Student Name', 'Enrollment No', 'Total Amount', 'Amount Paid', 'Amount Remaining', 'Payment Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(payment => [
        payment.monthlyPaymentId,
        `"${payment.student?.studentName || 'N/A'}"`,
        `"${payment.student?.enrollmentNo || 'N/A'}"`,
        payment.totalAmount || 0,
        payment.amountPaid || 0,
        payment.amountRemaining || 0,
        `"${new Date(payment.paymentDate).toLocaleDateString()}"`,
        `"${this.getPaymentStatus(payment)}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Legacy methods for backward compatibility
  customPaymentIdFilter(args: any): void {
    const filterValue = this.searchPaymentId.toLowerCase();
    args.dataSource = this.monthlyPayments.filter(mp => mp.monthlyPaymentId.toString().toLowerCase().includes(filterValue));
  }

  customPaymentIdSearch(): void {
    this.searchTerm = this.searchPaymentId;
    this.onSearch();
  }
}
