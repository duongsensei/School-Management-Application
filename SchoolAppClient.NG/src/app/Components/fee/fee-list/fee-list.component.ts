import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Fee, Frequency } from '../../../Models/fee';
import { Router } from '@angular/router';
import { FeeService } from '../../../Services/fee-service.service';
import { EditSettingsModel, FilterSettingsModel, PageSettingsModel, SearchSettingsModel, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrl: './fee-list.component.css'
})
export class FeeListComponent implements OnInit, OnDestroy {

  // Data properties
  fees: Fee[] = [];
  filteredFees: Fee[] = [];
  paginatedFees: Fee[] = [];
  selectedFees: Fee[] = [];

  // Loading state
  loading = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Statistics
  totalFees = 0;
  monthlyFees = 0;
  yearlyFees = 0;

  // Filter and search properties
  searchTerm = '';
  sortBy = 'type-asc';
  frequencyFilter = '';
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
  feeIdToDelete: number | undefined;

  public editSettings: EditSettingsModel = {
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Normal'
  };

  public toolbarOptions?: ToolbarItems[] = ['Search', 'ColumnChooser'];

  public selectionOptions: SelectionSettingsModel = {
    mode: 'Row',
    type: 'Single'
  };

  public searchOptions: SearchSettingsModel = {
    fields: ['feeId', 'feeName'],
    operator: 'contains',
    ignoreCase: true,
    ignoreAccent: true
  };

  public pageSettings: PageSettingsModel = {
    pageSize: 10
  };

  public filterSettings: FilterSettingsModel = {
    type: 'Menu'
  };

  constructor(private feeService: FeeService, private router: Router) { }

  ngOnInit(): void {
    this.loadFees();
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

  loadFees(): void {
    this.loading = true;
    this.feeService.getAllFees().subscribe({
      next: (data: Fee[]) => {
        this.fees = data;
        this.calculateStatistics();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fees:', error);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalFees = this.fees.length;
    this.monthlyFees = this.fees.filter(fee => fee.paymentFrequency === Frequency.Monthly).length;
    this.yearlyFees = this.fees.filter(fee => fee.paymentFrequency === Frequency.Yearly).length;
  }

  // Frequency classification methods
  getFrequencyDisplay(frequency: Frequency): string {
    return frequency || 'Not specified';
  }

  getFrequencyClass(frequency: Frequency): string {
    switch (frequency) {
      case Frequency.Monthly:
        return 'monthly';
      case Frequency.Yearly:
        return 'yearly';
      case Frequency.Quarterly:
        return 'quarterly';
      case Frequency.Semesterly:
        return 'semesterly';
      default:
        return 'other';
    }
  }

  getFrequencyIcon(frequency: Frequency): string {
    switch (frequency) {
      case Frequency.Monthly:
        return 'event_repeat';
      case Frequency.Yearly:
        return 'today';
      case Frequency.Quarterly:
        return 'calendar_view_month';
      case Frequency.Semesterly:
        return 'date_range';
      default:
        return 'schedule';
    }
  }

  // Statistics calculation methods
  getMonthlyPercentage(): number {
    return this.totalFees > 0 ? (this.monthlyFees / this.totalFees) * 100 : 0;
  }

  getYearlyPercentage(): number {
    return this.totalFees > 0 ? (this.yearlyFees / this.totalFees) * 100 : 0;
  }

  getSelectionPercentage(): number {
    return this.totalFees > 0 ? (this.selectedFees.length / this.totalFees) * 100 : 0;
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
    let filtered = [...this.fees];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(fee =>
        fee.feeId.toString().includes(term) ||
        (fee.feeType?.typeName && fee.feeType.typeName.toLowerCase().includes(term)) ||
        (fee.standard?.standardName && fee.standard.standardName.toLowerCase().includes(term)) ||
        fee.paymentFrequency.toLowerCase().includes(term)
      );
    }

    // Apply frequency filter
    if (this.frequencyFilter) {
      filtered = filtered.filter(fee => fee.paymentFrequency === this.frequencyFilter);
    }

    // Apply amount filter
    if (this.amountFilter) {
      filtered = filtered.filter(fee => {
        const amount = fee.amount || 0;
        switch (this.amountFilter) {
          case 'low':
            return amount < 1000;
          case 'medium':
            return amount >= 1000 && amount <= 5000;
          case 'high':
            return amount > 5000;
          default:
            return true;
        }
      });
    }

    this.filteredFees = filtered;
    this.applySorting();
    this.updatePagination();
  }

  applySorting(): void {
    this.filteredFees.sort((a, b) => {
      switch (this.sortBy) {
        case 'type-asc':
          return (a.feeType?.typeName || '').localeCompare(b.feeType?.typeName || '');
        case 'type-desc':
          return (b.feeType?.typeName || '').localeCompare(a.feeType?.typeName || '');
        case 'amount-asc':
          return (a.amount || 0) - (b.amount || 0);
        case 'amount-desc':
          return (b.amount || 0) - (a.amount || 0);
        case 'due-asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due-desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        default:
          return 0;
      }
    });
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.frequencyFilter = '';
    this.amountFilter = '';
    this.sortBy = 'type-asc';
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredFees.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFees = this.filteredFees.slice(startIndex, endIndex);
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
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredFees.length);
  }

  // View methods
  setView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  // Selection methods
  isSelected(fee: Fee): boolean {
    return this.selectedFees.some(f => f.feeId === fee.feeId);
  }

  toggleSelection(fee: Fee): void {
    if (this.isSelected(fee)) {
      this.selectedFees = this.selectedFees.filter(f => f.feeId !== fee.feeId);
    } else {
      this.selectedFees.push(fee);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedFees.length > 0 &&
      this.paginatedFees.every(fee => this.isSelected(fee));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedFees = this.selectedFees.filter(selected =>
        !this.paginatedFees.some(paginated => paginated.feeId === selected.feeId)
      );
    } else {
      this.paginatedFees.forEach(fee => {
        if (!this.isSelected(fee)) {
          this.selectedFees.push(fee);
        }
      });
    }
  }

  selectAll(): void {
    this.selectedFees = [...this.filteredFees];
  }

  clearSelection(): void {
    this.selectedFees = [];
  }

  // Action methods
  viewFeeDetails(fee: Fee): void {
    console.log('View fee details:', fee);
    // TODO: Implement fee details view
  }

  confirmDelete(id: number): void {
    this.confirmationDialogVisible = true;
    this.feeIdToDelete = id;
  }

  deleteFee(): void {
    if (this.feeIdToDelete !== undefined) {
      this.feeService.deleteFee(this.feeIdToDelete).subscribe({
        next: () => {
          this.fees = this.fees.filter(fee => fee.feeId !== this.feeIdToDelete);
          this.calculateStatistics();
          this.applyFilters();
          this.closeConfirmationDialog();
        },
        error: (error) => {
          console.error('Error deleting fee:', error);
          this.closeConfirmationDialog();
        }
      });
    }
  }

  closeConfirmationDialog(): void {
    this.confirmationDialogVisible = false;
    this.feeIdToDelete = undefined;
  }

  // Bulk operations
  bulkEdit(): void {
    console.log('Bulk edit fees:', this.selectedFees);
    // TODO: Implement bulk edit functionality
  }

  bulkDelete(): void {
    if (this.selectedFees.length > 0) {
      const confirmMessage = `Are you sure you want to delete ${this.selectedFees.length} fees?`;
      if (confirm(confirmMessage)) {
        // TODO: Implement bulk delete functionality
        console.log('Bulk delete fees:', this.selectedFees);
      }
    }
  }

  // Export functionality
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredFees);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fees-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: Fee[]): string {
    const headers = ['Fee ID', 'Fee Type', 'Standard', 'Payment Frequency', 'Amount', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(fee => [
        fee.feeId,
        `"${fee.feeType?.typeName || 'N/A'}"`,
        `"${fee.standard?.standardName || 'N/A'}"`,
        `"${fee.paymentFrequency}"`,
        fee.amount || 0,
        `"${new Date(fee.dueDate).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}
