import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Staff, Designation } from '../../../Models/staff';
import { StaffService } from '../../../Services/staff.service';
import { DetailDataBoundEventArgs, EditSettingsModel, FilterSettingsModel, Grid, GridComponent, PageSettingsModel, SearchSettingsModel, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { StaffReportService } from '../../../Services/Reports/staff-report.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})

export class StaffListComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: any;

  // Data properties
  public staffList: Staff[] = [];
  public filteredStaff: Staff[] = [];
  public selectedStaff: Staff[] = [];

  // UI state properties
  public loading = false;
  public viewMode: 'table' | 'card' = 'table';
  public currentPage = 1;

  // Header scroll state
  public isHeaderScrolled = false;

  // Search and filter properties
  public searchTerm = '';
  public searchName = '';
  public showAdvancedFilters = false;
  public selectedSort = '';
  public selectedDepartment = '';
  public selectedStaffType = '';
  public quickFilter = 'all';
  public selectAll = false;
  public departments: any[] = [];

  // Grid settings
  public editSettings?: EditSettingsModel;
  public pageSettings: PageSettingsModel = { pageSize: 10 };
  public filterSettings: FilterSettingsModel = { type: 'FilterBar' };
  public toolbarOptions?: ToolbarItems[] = ['Search', 'Print', 'ColumnChooser', 'Add', 'Edit', 'Delete', 'Update', 'Cancel', 'PdfExport', 'ExcelExport', 'CsvExport'];
  public selectionOptions?: SelectionSettingsModel;
  public searchOptions?: SearchSettingsModel;
  
  errorMessage!: string;

  constructor(private staffService: StaffService, private staffReportService: StaffReportService) { }

  ngOnInit(): void {
    this.loadStaffList();
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.selectionOptions = { mode: 'Row', type: 'Single' };
    this.searchOptions = { fields: ['staffName', 'designation'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
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

  // Data loading methods
  loadStaffList(): void {
    this.loading = true;
    this.staffService.getAllStaffs().subscribe({
      next: (staffs) => {
        this.staffList = staffs;        
        this.filteredStaff = [...staffs];
        this.departments = this.getDepartments();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching staff list:', error);
        this.errorMessage = 'An error occurred while fetching the staff list. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Statistics methods
  getTotalStaff(): number {
    return this.staffList.length;
  }

  getTeachersCount(): number {
    return this.staffList.filter(staff => this.isTeacher(staff.designation)).length;
  }

  getTeachersPercentage(): number {
    const total = this.getTotalStaff();
    return total > 0 ? (this.getTeachersCount() / total) * 100 : 0;
  }

  getAdminCount(): number {
    return this.staffList.filter(staff => this.isAdmin(staff.designation)).length;
  }

  getAdminPercentage(): number {
    const total = this.getTotalStaff();
    return total > 0 ? (this.getAdminCount() / total) * 100 : 0;
  }

  getSelectionPercentage(): number {
    const total = this.getTotalStaff();
    return total > 0 ? (this.selectedStaff.length / total) * 100 : 0;
  }

  // Helper methods
  isTeacher(designation?: Designation): boolean {
    return designation === Designation.Professor ||
      designation === Designation.Instructor ||
      designation === Designation.Lecturer ||
      designation === Designation.TeachingAssistant ||
      designation === Designation.SpecialEducationTeacher;
  }

  isAdmin(designation?: Designation): boolean {
    return designation === Designation.Superintendent ||
      designation === Designation.Headmaster ||
      designation === Designation.Headmistress ||
      designation === Designation.AssistantPrincipal ||
      designation === Designation.Dean ||
      designation === Designation.Director ||
      designation === Designation.Registrar ||
      designation === Designation.AdmissionsOfficer ||
      designation === Designation.BusinessManager ||
      designation === Designation.HumanResourcesManager;
  }

  getDesignationName(designation?: Designation): string {
    if (designation === undefined) return 'Not specified';
    return Designation[designation];
  }

  getStaffType(staff: Staff): string {
    if (this.isTeacher(staff.designation)) {
      return 'Teacher';
    } else if (this.isAdmin(staff.designation)) {
      return 'Administrative';
    } else {
      return 'Other';
    }
  }

  // Search and filter methods
  performSearch(): void {
    this.searchName = this.searchTerm;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchName = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.staffList];

    // Apply search filter
    if (this.searchName.trim()) {
      const searchTerm = this.searchName.toLowerCase().trim();
      filtered = filtered.filter(staff =>
        staff.staffName.toLowerCase().includes(searchTerm) ||
        staff.staffId.toString().includes(searchTerm) ||
        staff.email?.toLowerCase().includes(searchTerm) ||
        staff.department?.departmentName?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(staff => staff.departmentId?.toString() === this.selectedDepartment);
    }

    // Apply staff type filter
    if (this.selectedStaffType) {
      if (this.selectedStaffType === 'teacher') {
        filtered = filtered.filter(staff => this.isTeacher(staff.designation));
      } else if (this.selectedStaffType === 'admin') {
        filtered = filtered.filter(staff => this.isAdmin(staff.designation));
      }
    }

    // Apply quick filter
    if (this.quickFilter === 'teachers') {
      filtered = filtered.filter(staff => this.isTeacher(staff.designation));
    } else if (this.quickFilter === 'admin') {
      filtered = filtered.filter(staff => this.isAdmin(staff.designation));
    }

    // Apply sorting
    if (this.selectedSort) {
      switch (this.selectedSort) {
        case 'name-asc':
          filtered.sort((a, b) => a.staffName.localeCompare(b.staffName));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.staffName.localeCompare(a.staffName));
          break;
        case 'id-asc':
          filtered.sort((a, b) => a.staffId - b.staffId);
          break;
        case 'id-desc':
          filtered.sort((a, b) => b.staffId - a.staffId);
          break;
        case 'designation':
          filtered.sort((a, b) => this.getDesignationName(a.designation).localeCompare(this.getDesignationName(b.designation)));
          break;
      }
    }

    this.filteredStaff = filtered;
    this.currentPage = 1;
  }

  hasActiveFilters(): boolean {
    return !!(this.searchName.trim() || this.selectedSort || this.selectedDepartment || this.selectedStaffType || this.quickFilter !== 'all');
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.searchName = '';
    this.selectedSort = '';
    this.selectedDepartment = '';
    this.selectedStaffType = '';
    this.quickFilter = 'all';
    this.applyFilters();
  }

  applyAdvancedFilters(): void {
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

  // Data access methods
  getFilteredStaff(): Staff[] {
    return this.filteredStaff;
  }

  getPaginatedStaff(): Staff[] {
    const pageSize = this.pageSettings?.pageSize ?? 10;
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.filteredStaff.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredStaff.length / (this.pageSettings?.pageSize ?? 10));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getDisplayedRecordsStart(): number {
    if (this.filteredStaff.length === 0) return 0;
    return (this.currentPage - 1) * (this.pageSettings?.pageSize ?? 10) + 1;
  }

  getDisplayedRecordsEnd(): number {
    const end = this.currentPage * (this.pageSettings?.pageSize ?? 10);
    return Math.min(end, this.filteredStaff.length);
  }

  // Selection methods
  toggleSelectAll(event: any): void {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.selectedStaff = [...this.filteredStaff];
    } else {
      this.selectedStaff = [];
    }
  }

  toggleSelectStaff(staff: Staff, event: any): void {
    if (event.target.checked) {
      if (!this.isSelected(staff)) {
        this.selectedStaff.push(staff);
      }
    } else {
      this.selectedStaff = this.selectedStaff.filter(s => s.staffId !== staff.staffId);
    }
    this.selectAll = this.selectedStaff.length === this.filteredStaff.length;
  }

  isSelected(staff: Staff): boolean {
    return this.selectedStaff.some(s => s.staffId === staff.staffId);
  }

  clearSelection(): void {
    this.selectedStaff = [];
    this.selectAll = false;
  }

  // Export methods
  exportStaff(): void {
    if (this.filteredStaff.length === 0) return;

    const headers = ['Staff ID', 'Name', 'Department', 'Designation', 'Email', 'Contact'];
    const csvContent = [
      headers.join(','),
      ...this.filteredStaff.map(staff =>
        `${staff.staffId},"${staff.staffName}","${staff.department?.departmentName || 'Unassigned'}","${this.getDesignationName(staff.designation)}","${staff.email || ''}","${staff.contactNumber1 || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  bulkExport(): void {
    if (this.selectedStaff.length === 0) return;

    const headers = ['Staff ID', 'Name', 'Department', 'Designation', 'Email', 'Contact'];
    const csvContent = [
      headers.join(','),
      ...this.selectedStaff.map(staff =>
        `${staff.staffId},"${staff.staffName}","${staff.department?.departmentName || 'Unassigned'}","${this.getDesignationName(staff.designation)}","${staff.email || ''}","${staff.contactNumber1 || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `selected_staff_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Department helper method
  getDepartments(): any[] {
    const departments = this.staffList
      .filter(staff => staff.department)
      .map(staff => staff.department!)
      .filter((dept, index, self) => self.findIndex(d => d.departmentId === dept.departmentId) === index);
    return departments;
  }

  // Report generation
  LoadReport(): void {
    this.staffReportService.GetReport().subscribe({
      next: (data) => {
      const basedata = "data:application/pdf;base64," + data;
      this.downloadFileObject(basedata);
      },
      error: (error) => {
      console.log('Observable emitted an error: ' + JSON.stringify(error));
      }
    });
  }

  downloadFileObject(base64String: string): void {
    const linkSource = base64String;
    const downloadLink = document.createElement("a");
    const fileName = "staff_report.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  // Bulk operations
  bulkDelete(): void {
    if (this.selectedStaff.length === 0) return;

    if (confirm(`Are you sure you want to delete ${this.selectedStaff.length} staff member(s)?`)) {
      // Here you would typically call a service method to delete the selected staff
      console.log('Bulk delete:', this.selectedStaff);

      // For now, just remove from local arrays
      this.selectedStaff.forEach(staff => {
        this.staffList = this.staffList.filter(s => s.staffId !== staff.staffId);
        this.filteredStaff = this.filteredStaff.filter(s => s.staffId !== staff.staffId);
      });

      this.clearSelection();
    }
  }

  // TrackBy function for performance
  trackByStaffId(index: number, staff: Staff): number {
    return staff.staffId;
  }
}

