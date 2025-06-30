import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FeeTypeService } from '../../../Services/feetype.service';
import { Router } from '@angular/router';
import { FeeType } from '../../../Models/feetype';

@Component({
  selector: 'app-feetype-list',
  templateUrl: './feetype-list.component.html',
  styleUrl: './feetype-list.component.css'
})
export class FeetypeListComponent implements OnInit, OnDestroy {

  // Data properties
  feeTypes: FeeType[] = [];
  filteredFeeTypes: FeeType[] = [];
  paginatedFeeTypes: FeeType[] = [];
  selectedFeeTypes: FeeType[] = [];

  // Loading state
  loading = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Statistics
  totalFeeTypes = 0;
  academicFeeTypes = 0;
  extraFeeTypes = 0;

  // Filter and search properties
  searchTerm = '';
  sortBy = 'name-asc';
  categoryFilter = '';
  showAdvancedFilters = false;

  // Pagination properties
  currentPage = 1;
  pageSize = 25;
  totalPages = 1;

  // View properties
  currentView: 'table' | 'cards' = 'table';

  // Confirmation dialog
  confirmationDialogVisible = false;
  feeTypeIdToDelete: number | undefined;

  constructor(private feeTypeService: FeeTypeService, private router: Router) { }

  ngOnInit(): void {
    this.loadFeeTypes();
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

  loadFeeTypes(): void {
    this.loading = true;
    this.feeTypeService.getFeeTypes().subscribe({
      next: (data: FeeType[]) => {
        this.feeTypes = data;
        this.calculateStatistics();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading fee types:', error);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalFeeTypes = this.feeTypes.length;
    this.academicFeeTypes = this.feeTypes.filter(ft => this.isAcademicFee(ft.typeName)).length;
    this.extraFeeTypes = this.feeTypes.filter(ft => this.isExtraActivityFee(ft.typeName)).length;
  }

  // Category classification methods
  isAcademicFee(typeName: string): boolean {
    const academicKeywords = ['tuition', 'admission', 'registration', 'exam', 'course', 'semester', 'academic', 'enrollment'];
    return academicKeywords.some(keyword => typeName.toLowerCase().includes(keyword));
  }

  isExtraActivityFee(typeName: string): boolean {
    const extraKeywords = ['sports', 'library', 'lab', 'laboratory', 'transport', 'hostel', 'activity', 'club', 'event'];
    return extraKeywords.some(keyword => typeName.toLowerCase().includes(keyword));
  }

  getCategory(typeName: string): string {
    if (this.isAcademicFee(typeName)) return 'Academic';
    if (this.isExtraActivityFee(typeName)) return 'Extra Activities';
    return 'Other';
  }

  getCategoryClass(typeName: string): string {
    if (this.isAcademicFee(typeName)) return 'academic';
    if (this.isExtraActivityFee(typeName)) return 'extra';
    return 'other';
  }

  getCategoryIcon(typeName: string): string {
    if (this.isAcademicFee(typeName)) return 'school';
    if (this.isExtraActivityFee(typeName)) return 'local_activity';
    return 'category';
  }

  // Statistics calculation methods
  getAcademicPercentage(): number {
    return this.totalFeeTypes > 0 ? (this.academicFeeTypes / this.totalFeeTypes) * 100 : 0;
  }

  getExtraPercentage(): number {
    return this.totalFeeTypes > 0 ? (this.extraFeeTypes / this.totalFeeTypes) * 100 : 0;
  }

  getSelectionPercentage(): number {
    return this.totalFeeTypes > 0 ? (this.selectedFeeTypes.length / this.totalFeeTypes) * 100 : 0;
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
    let filtered = [...this.feeTypes];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(feeType =>
        feeType.typeName.toLowerCase().includes(term) ||
        feeType.feeTypeId.toString().includes(term)
      );
    }

    // Apply category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(feeType => {
        const category = this.getCategory(feeType.typeName).toLowerCase();
        return this.categoryFilter === 'academic' && category === 'academic' ||
          this.categoryFilter === 'extra' && category === 'extra activities' ||
          this.categoryFilter === 'other' && category === 'other';
      });
    }

    this.filteredFeeTypes = filtered;
    this.applySorting();
    this.updatePagination();
  }

  applySorting(): void {
    this.filteredFeeTypes.sort((a, b) => {
      switch (this.sortBy) {
        case 'name-asc':
          return a.typeName.localeCompare(b.typeName);
        case 'name-desc':
          return b.typeName.localeCompare(a.typeName);
        case 'id-asc':
          return a.feeTypeId - b.feeTypeId;
        case 'id-desc':
          return b.feeTypeId - a.feeTypeId;
        default:
          return 0;
      }
    });
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.sortBy = 'name-asc';
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredFeeTypes.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFeeTypes = this.filteredFeeTypes.slice(startIndex, endIndex);
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
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredFeeTypes.length);
  }

  // View methods
  setView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  // Selection methods
  isSelected(feeType: FeeType): boolean {
    return this.selectedFeeTypes.some(ft => ft.feeTypeId === feeType.feeTypeId);
  }

  toggleSelection(feeType: FeeType): void {
    if (this.isSelected(feeType)) {
      this.selectedFeeTypes = this.selectedFeeTypes.filter(ft => ft.feeTypeId !== feeType.feeTypeId);
    } else {
      this.selectedFeeTypes.push(feeType);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedFeeTypes.length > 0 &&
      this.paginatedFeeTypes.every(feeType => this.isSelected(feeType));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedFeeTypes = this.selectedFeeTypes.filter(selected =>
        !this.paginatedFeeTypes.some(paginated => paginated.feeTypeId === selected.feeTypeId)
      );
    } else {
      this.paginatedFeeTypes.forEach(feeType => {
        if (!this.isSelected(feeType)) {
          this.selectedFeeTypes.push(feeType);
        }
      });
    }
  }

  selectAll(): void {
    this.selectedFeeTypes = [...this.filteredFeeTypes];
  }

  clearSelection(): void {
    this.selectedFeeTypes = [];
  }

  // Action methods
  viewFeeTypeDetails(feeType: FeeType): void {
    console.log('View fee type details:', feeType);
    // TODO: Implement fee type details view
  }

  confirmDelete(id: number): void {
    this.confirmationDialogVisible = true;
    this.feeTypeIdToDelete = id;
  }

  deleteFeeType(): void {
    if (this.feeTypeIdToDelete !== undefined) {
      this.feeTypeService.deleteFeeType(this.feeTypeIdToDelete).subscribe({
        next: () => {
          this.feeTypes = this.feeTypes.filter(feeType => feeType.feeTypeId !== this.feeTypeIdToDelete);
          this.calculateStatistics();
          this.applyFilters();
          this.closeConfirmationDialog();
        },
        error: (error) => {
          console.error('Error deleting fee type:', error);
          this.closeConfirmationDialog();
        }
      });
    }
  }

  closeConfirmationDialog(): void {
    this.confirmationDialogVisible = false;
    this.feeTypeIdToDelete = undefined;
  }

  // Bulk operations
  bulkEdit(): void {
    console.log('Bulk edit fee types:', this.selectedFeeTypes);
    // TODO: Implement bulk edit functionality
  }

  bulkDelete(): void {
    if (this.selectedFeeTypes.length > 0) {
      const confirmMessage = `Are you sure you want to delete ${this.selectedFeeTypes.length} fee types?`;
      if (confirm(confirmMessage)) {
        // TODO: Implement bulk delete functionality
        console.log('Bulk delete fee types:', this.selectedFeeTypes);
      }
    }
  }

  // Export functionality
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.filteredFeeTypes);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fee-types-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: FeeType[]): string {
    const headers = ['Fee Type ID', 'Type Name', 'Category'];
    const csvContent = [
      headers.join(','),
      ...data.map(feeType => [
        feeType.feeTypeId,
        `"${feeType.typeName}"`,
        `"${this.getCategory(feeType.typeName)}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}
