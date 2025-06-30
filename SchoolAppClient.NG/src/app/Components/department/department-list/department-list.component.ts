import { Component, OnInit, ViewChild } from '@angular/core';
import { Department } from '../../../Models/department';
import { DetailDataBoundEventArgs, EditSettingsModel, FilterSettingsModel, Grid, PageSettingsModel, SearchSettingsModel, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DepartmentServices } from '../../../Services/department.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ height: '0', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DepartmentListComponent implements OnInit {
  @ViewChild('grid') grid: any;

  // Data properties
  public departments: Department[] = [];
  public filteredDepartments: Department[] = [];
  public selectedDepartments: Department[] = [];

  // UI state properties
  public confirmationDialogVisible = false;
  public departmentIdToDelete: number | undefined;
  public loading = false;
  public viewMode: 'table' | 'card' = 'table';
  public currentPage = 1;

  // Search and filter properties
  public searchName = '';
  public showAdvancedFilters = false;
  public selectedSort = '';
  public quickFilter = 'all';
  public selectAll = false;

  // Grid settings
  public pageSettings: PageSettingsModel = { pageSize: 10 };
  public filterSettings: FilterSettingsModel = { type: 'Menu' };
  public searchSettings: SearchSettingsModel = {
    fields: ['departmentName'],
    operator: 'contains',
    ignoreCase: true
  };

  constructor(private departmentService: DepartmentServices, private router: Router) {
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  // Data loading methods
  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAllDepartment().subscribe({
      next: (data) => {
        this.departments = data;
        this.filteredDepartments = [...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.loading = false;
      }
    });
  }

  getDepartments(): void {
    this.loadDepartments();
  }

  // Statistics methods
  getTotalDepartments(): number {
    return this.departments.length;
  }

  getRecentAdditions(): number {
    // For demo purposes, return a fixed number
    // In real implementation, you would check creation dates
    return Math.floor(this.departments.length * 0.2);
  }

  getRecentAdditionsPercentage(): number {
    const total = this.getTotalDepartments();
    return total > 0 ? (this.getRecentAdditions() / total) * 100 : 0;
  }

  getSelectionPercentage(): number {
    const total = this.getTotalDepartments();
    return total > 0 ? (this.selectedDepartments.length / total) * 100 : 0;
  }

  // Search and filter methods
  performSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchName = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.departments];

    // Apply search filter
    if (this.searchName.trim()) {
      const searchTerm = this.searchName.toLowerCase().trim();
      filtered = filtered.filter(dept =>
        dept.departmentName.toLowerCase().includes(searchTerm) ||
        dept.departmentId.toString().includes(searchTerm)
      );
    }

    // Apply quick filter
    if (this.quickFilter === 'recent') {
      // For demo purposes, show last 20% as recent
      const recentCount = Math.ceil(this.departments.length * 0.2);
      filtered = filtered.slice(-recentCount);
    }

    // Apply sorting
    if (this.selectedSort) {
      switch (this.selectedSort) {
        case 'name-asc':
          filtered.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.departmentName.localeCompare(a.departmentName));
          break;
        case 'id-asc':
          filtered.sort((a, b) => a.departmentId - b.departmentId);
          break;
        case 'id-desc':
          filtered.sort((a, b) => b.departmentId - a.departmentId);
          break;
      }
    }

    this.filteredDepartments = filtered;
    this.currentPage = 1; // Reset to first page when filters change
  }

  hasActiveFilters(): boolean {
    return !!(this.searchName.trim() || this.selectedSort || this.quickFilter !== 'all');
  }

  clearAllFilters(): void {
    this.searchName = '';
    this.selectedSort = '';
    this.quickFilter = 'all';
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applySorting(): void {
    this.applyFilters();
  }

  setQuickFilter(filter: string): void {
    this.quickFilter = filter;
    this.applyFilters();
  }

  // Advanced filter methods
  applyQuickFilter(): void {
    this.applyFilters();
  }

  applyAdvancedFilters(): void {
    this.applyFilters();
  }

  // View mode methods
  setViewMode(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }

  updatePageSize(): void {
    this.currentPage = 1;
    if (this.grid) {
      this.grid.refresh();
    }
  }

  // Pagination methods for card view
  getTotalPages(): number {
    return Math.ceil(this.filteredDepartments.length / (this.pageSettings?.pageSize ?? 10));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getPaginatedDepartments(): Department[] {
    const pageSize = this.pageSettings?.pageSize ?? 10;
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.filteredDepartments.slice(startIndex, endIndex);
  }

  getFilteredDepartments(): Department[] {
    return this.filteredDepartments;
  }

  // Display helper methods
  getDisplayedRecordsStart(): number {
    if (this.filteredDepartments.length === 0) return 0;
    return (this.currentPage - 1) * (this.pageSettings?.pageSize ?? 10) + 1;
  }

  getDisplayedRecordsEnd(): number {
    const end = this.currentPage * (this.pageSettings?.pageSize ?? 10);
    return Math.min(end, this.filteredDepartments.length);
  }

  // Selection methods
  toggleSelectAll(event: any): void {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.selectedDepartments = [...this.filteredDepartments];
    } else {
      this.selectedDepartments = [];
    }
  }

  toggleSelectDepartment(department: Department, event: any): void {
    if (event.target.checked) {
      if (!this.isSelected(department)) {
        this.selectedDepartments.push(department);
      }
    } else {
      this.selectedDepartments = this.selectedDepartments.filter(d => d.departmentId !== department.departmentId);
    }

    // Update select all checkbox
    this.selectAll = this.selectedDepartments.length === this.filteredDepartments.length;
  }

  isSelected(department: Department): boolean {
    return this.selectedDepartments.some(d => d.departmentId === department.departmentId);
  }

  clearSelection(): void {
    this.selectedDepartments = [];
    this.selectAll = false;
  }

  // Bulk action methods
  bulkExport(): void {
    if (this.selectedDepartments.length === 0) return;

    // Create CSV content
    const headers = ['Department ID', 'Department Name', 'Status'];
    const csvContent = [
      headers.join(','),
      ...this.selectedDepartments.map(dept =>
        `${dept.departmentId},"${dept.departmentName}","Active"`
      )
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `departments_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  bulkDelete(): void {
    if (this.selectedDepartments.length === 0) return;

    if (confirm(`Are you sure you want to delete ${this.selectedDepartments.length} department(s)?`)) {
      // For demo purposes, we'll just remove from local array
      // In real implementation, you would call the API for each department
      this.selectedDepartments.forEach(dept => {
        this.departments = this.departments.filter(d => d.departmentId !== dept.departmentId);
      });

      this.clearSelection();
      this.applyFilters();
    }
  }

  exportDepartments(): void {
    if (this.filteredDepartments.length === 0) return;

    // Create CSV content for all filtered departments
    const headers = ['Department ID', 'Department Name', 'Status'];
    const csvContent = [
      headers.join(','),
      ...this.filteredDepartments.map(dept =>
        `${dept.departmentId},"${dept.departmentName}","Active"`
      )
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_departments_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Delete methods
  confirmDelete(id: number): void {
    this.confirmationDialogVisible = true;
    this.departmentIdToDelete = id;
  }

  deleteDepartment(): void {
    if (this.departmentIdToDelete !== undefined) {
      this.departmentService.deleteDepartment(this.departmentIdToDelete).subscribe({
        next: () => {
          this.departments = this.departments.filter(department => department.departmentId !== this.departmentIdToDelete);
          this.applyFilters();
          this.closeConfirmationDialog();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
          this.closeConfirmationDialog();
        }
      });
    }
  }

  closeConfirmationDialog(): void {
    this.confirmationDialogVisible = false;
    this.departmentIdToDelete = undefined;
  }

  // Legacy methods (kept for compatibility)
  customNameFilter(args: any): void {
    const filterValue = this.searchName.toLowerCase();
    args.dataSource = this.departments.filter(department => department.departmentName.toLowerCase().includes(filterValue));
  }

  customNameSearch(): void {
    if (this.grid) {
      this.grid.search(this.searchName);
    }
  }

  // TrackBy function for performance
  trackByDepartmentId(index: number, department: Department): number {
    return department.departmentId;
  }
}
