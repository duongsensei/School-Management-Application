import { Component, OnInit } from '@angular/core';
import { Attendance, AttendanceType } from '../../../Models/attendance';
import { AttendanceService } from '../../../Services/attendance.service';
import { Router } from '@angular/router';
import { EditSettingsModel, FilterSettingsModel, PageSettingsModel, SearchSettingsModel, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { StaffReportService } from '../../../Services/Reports/staff-report.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {
  attendances: Attendance[] = [];
  filteredAttendances: Attendance[] = [];
  paginatedAttendances: Attendance[] = [];

  // Search and filter properties
  searchTerm = '';
  selectedType = '';
  selectedStatus = '';
  selectedDate = '';

  // UI state properties
  isLoading = false;
  viewMode: 'table' | 'card' = 'table';

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  public editSettings?: EditSettingsModel;
  public pageSettings: PageSettingsModel = { pageSize: 5 };
  public filterSettings: FilterSettingsModel = { type: 'FilterBar' };
  public toolbarOptions?: ToolbarItems[] = ['Search',
    'Print',
    'ColumnChooser',
    'Add', 'Edit', 'Delete', 'Update', 'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport'
  ];
  public selectionOptions?: SelectionSettingsModel;
  public searchOptions?: SearchSettingsModel;

  constructor(private attendanceService: AttendanceService, private router: Router, private staffReportService: StaffReportService) { }

  ngOnInit(): void {
    this.getAttendances();

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.selectionOptions = { mode: 'Row', type: 'Single' };
    this.searchOptions = { fields: ['staffName', 'designation'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
  }

  getAttendances(): void {
    this.isLoading = true;
    this.attendanceService.getAttendances().subscribe({
      next: (attendances) => {
        this.attendances = attendances;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching attendances:', error);
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

  // Filter functionality
  onTypeFilter(event: any): void {
    this.selectedType = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilter(event: any): void {
    this.selectedStatus = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onDateFilter(event: any): void {
    this.selectedDate = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Apply all filters
  applyFilters(): void {
    if (!this.attendances || this.attendances.length === 0) {
      this.filteredAttendances = [];
      this.updatePagination();
      return;
    }

    this.filteredAttendances = this.attendances.filter(attendance => {
      // Search filter
      const matchesSearch = !this.searchTerm ||
        attendance.attendanceId.toString().includes(this.searchTerm) ||
        (attendance.description && attendance.description.toLowerCase().includes(this.searchTerm)) ||
        attendance.attendanceIdentificationNumber.toString().includes(this.searchTerm);

      // Type filter
      const matchesType = this.selectedType === '' ||
        attendance.type.toString() === this.selectedType;

      // Status filter
      const matchesStatus = this.selectedStatus === '' ||
        attendance.isPresent.toString() === this.selectedStatus;

      // Date filter
      const matchesDate = !this.selectedDate ||
        new Date(attendance.date).toISOString().split('T')[0] === this.selectedDate;

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    this.updatePagination();
  }

  // Clear all filters
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.selectedDate = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination functionality
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAttendances.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAttendances = this.filteredAttendances.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // View mode functionality
  setViewMode(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }

  // Statistics methods
  getPresentCount(): number {
    if (!this.filteredAttendances || this.filteredAttendances.length === 0) return 0;
    return this.filteredAttendances.filter(attendance => attendance.isPresent).length;
  }

  getAbsentCount(): number {
    if (!this.filteredAttendances || this.filteredAttendances.length === 0) return 0;
    return this.filteredAttendances.filter(attendance => !attendance.isPresent).length;
  }

  getAttendanceRate(): number {
    if (!this.filteredAttendances || this.filteredAttendances.length === 0) return 0;
    const presentCount = this.getPresentCount();
    return Math.round((presentCount / this.filteredAttendances.length) * 100);
  }

  // Helper methods
  getTypeLabel(type: AttendanceType): string {
    return type === AttendanceType.Student ? 'Student' : 'Staff';
  }

  // Action methods
  viewAttendanceDetails(attendance: Attendance): void {
    console.log('View attendance details:', attendance);
    // You can implement navigation to a details page or show modal here
    // this.router.navigate(['/attendance', attendance.attendanceId, 'details']);
  }

  deleteAttendance(id: number): void {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      // Implement delete functionality
      console.log('Delete attendance:', id);
      // this.attendanceService.deleteAttendance(id).subscribe({
      //   next: () => {
      //     this.attendances = this.attendances.filter(attendance => attendance.attendanceId !== id);
      //     this.applyFilters();
      //   },
      //   error: (error) => {
      //     console.error('Error deleting attendance:', error);
      //   }
      // });
    }
  }

  // Utility methods
  refreshData(): void {
    this.getAttendances();
  }

  exportData(): void {
    console.log('Export functionality to be implemented');
    // Implement export functionality
  }

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
    const fileName = "attendance_report.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  // Math helper for template
  Math = Math;
}
