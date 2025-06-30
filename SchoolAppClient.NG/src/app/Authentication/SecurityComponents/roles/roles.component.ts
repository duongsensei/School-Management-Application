import { Component, inject, OnInit, HostListener } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { AuthService } from '../../SecurityModels/auth.service';
import { AppRole } from '../../SecurityModels/auth-response';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {

  public roles: AppRole[] = [];

  model: AppRole = new AppRole();
  errorMessage!: string | null;
  state = 'list';

  // Search and filtering
  searchTerm: string = '';
  selectedRoleType: string = '';
  filteredRoles: AppRole[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6; // Show fewer items since cards take more space

  // View mode
  viewMode: 'card' | 'table' = 'card';

  // Loading state
  isLoading: boolean = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Form fields
  roleDescription: string = '';
  roleType: string = 'user';

  // Delete modal
  showDeleteModal: boolean = false;
  roleToDelete: string = '';

  private service = inject(AuthService);

  public pageSettings: PageSettingsModel = { pageSize: 5 };

  constructor() { }

  ngOnInit() {
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
    this.state = 'list';
    this.service.roles().subscribe({
      next: (response: AppRole[]) => {
        this.roles = response;
        this.applyFilters();
        this.isLoading = false;
        console.log('Roles loaded:', response);
      },
      error: (error) => {
        console.log('Error loading roles:', error);
        this.isLoading = false;
      }
    });
  }

  // Statistics methods
  getTotalRoles(): number {
    return this.roles?.length || 0;
  }

  getAdminRoles(): number {
    return this.roles?.filter(role =>
      role.name.toLowerCase().includes('admin')
    ).length || 0;
  }

  getUserRoles(): number {
    return this.roles?.filter(role =>
      role.name.toLowerCase().includes('user') || role.name.toLowerCase().includes('student')
    ).length || 0;
  }

  getActiveRoles(): number {
    // For now, assume all roles are active since we don't have status field
    return this.roles?.length || 0;
  }

  // Search and filtering
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...(this.roles || [])];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchLower) ||
        role.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply role type filter
    if (this.selectedRoleType.trim()) {
      filtered = filtered.filter(role =>
        this.getRoleType(role.name).toLowerCase().includes(this.selectedRoleType.toLowerCase())
      );
    }

    this.filteredRoles = filtered;
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedRoleType = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  getFilteredRoles(): AppRole[] {
    return this.filteredRoles || [];
  }

  // Pagination methods
  getPaginatedRoles(): AppRole[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.getFilteredRoles().slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredRoles().length / this.pageSize);
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
    if (this.getFilteredRoles().length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationEnd(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.getFilteredRoles().length);
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
    // Reset pagination when changing view mode
    this.currentPage = 1;
  }

  // Role helper methods
  getRoleIcon(roleName: string): string {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'admin_panel_settings';
    if (name.includes('teacher')) return 'school';
    if (name.includes('student')) return 'person';
    if (name.includes('staff')) return 'badge';
    if (name.includes('manager')) return 'manage_accounts';
    if (name.includes('user')) return 'group';
    return 'security';
  }

  getRoleType(roleName: string): string {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'Administrator';
    if (name.includes('teacher')) return 'Teacher';
    if (name.includes('student')) return 'Student';
    if (name.includes('staff')) return 'Staff';
    if (name.includes('manager')) return 'Manager';
    return 'User';
  }

  getRoleTypeClass(roleName: string): string {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'admin-badge';
    if (name.includes('teacher')) return 'teacher-badge';
    if (name.includes('student')) return 'student-badge';
    if (name.includes('staff')) return 'staff-badge';
    if (name.includes('manager')) return 'manager-badge';
    return 'user-badge';
  }

  getRoleTypeIcon(roleName: string): string {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'admin_panel_settings';
    if (name.includes('teacher')) return 'school';
    if (name.includes('student')) return 'person';
    if (name.includes('staff')) return 'work';
    if (name.includes('manager')) return 'manage_accounts';
    return 'group';
  }

  getRoleDescription(roleName: string): string {
    const name = roleName.toLowerCase();
    if (name.includes('admin')) return 'Full system access with administrative privileges';
    if (name.includes('teacher')) return 'Access to teaching tools and student management';
    if (name.includes('student')) return 'Limited access for learning and coursework';
    if (name.includes('staff')) return 'Access to staff-specific features and tools';
    if (name.includes('manager')) return 'Management access with oversight capabilities';
    return 'Standard user access with basic permissions';
  }

  // CRUD Operations
  editRole(edit: AppRole) {
    this.model = { ...edit };
    this.roleDescription = this.getRoleDescription(edit.name);
    this.roleType = this.getRoleType(edit.name).toLowerCase();
    this.state = 'entry';
  }

  createNew() {
    this.state = 'entry';
    this.model = new AppRole();
    this.roleDescription = '';
    this.roleType = 'user';
  }

  cancel() {
    this.state = 'list';
    this.model = new AppRole();
    this.roleDescription = '';
    this.roleType = 'user';
  }

  confirmDeleteRole(id: string): void {
    this.roleToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.roleToDelete = '';
  }

  deleteRole(id: string) {
    this.service.roleDelete(id).subscribe({
      next: (response: any) => {
        console.log('Role deleted successfully:', response);
        this.LoadData();
        this.closeDeleteModal();
      },
      error: (response: any) => {
        this.errorMessage = response.error || 'Failed to delete role';
        console.log('Error deleting role:', response);
        this.closeDeleteModal();
      }
    });
  }

  clearMessage() {
    this.errorMessage = null;
  }

  submitData(event: Event) {
    event.preventDefault();

    this.service.roleEntry(this.model).subscribe({
      next: (response: any) => {
        console.log('Role saved successfully:', response);
        this.LoadData();
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to save role';
        console.log('Error saving role:', error);
      }
    });
  }

  // View details (placeholder for future implementation)
  viewRoleDetails(role: AppRole): void {
    console.log('View role details:', role);
    // TODO: Implement role details view
  }

  // Export functionality
  exportRoles(): void {
    if (!this.roles || this.roles.length === 0) {
      return;
    }

    // Create CSV data
    const csvData = this.convertRolesToCSV(this.getFilteredRoles());

    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roles_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertRolesToCSV(roles: AppRole[]): string {
    const headers = [
      'Role ID',
      'Role Name',
      'Type',
      'Description'
    ];

    const rows: string[] = [headers.join(',')];

    roles.forEach(role => {
      const row = [
        role.id,
        `"${role.name}"`,
        `"${this.getRoleType(role.name)}"`,
        `"${this.getRoleDescription(role.name)}"`
      ];
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  // TrackBy functions for performance
  trackByRoleId(index: number, role: AppRole): string {
    return role.id;
  }
}
