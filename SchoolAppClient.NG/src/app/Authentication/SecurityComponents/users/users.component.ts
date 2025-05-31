import { Component, inject, OnInit, HostListener } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { AppUser } from '../../SecurityModels/auth-response';
import { AuthService } from '../../SecurityModels/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  public UserList: AppUser[] = [];

  // Search and filtering
  searchTerm: string = '';
  selectedRole: string = '';
  filteredUsers: AppUser[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6; // Show fewer items since cards take more space

  // View mode
  viewMode: 'card' | 'table' = 'card';

  // Loading state
  isLoading: boolean = false;

  // Header scroll state
  isHeaderScrolled = false;

  // Unique roles for filtering
  uniqueRoles: string[] = [];

  private service = inject(AuthService);

  public pageSettings: PageSettingsModel = { pageSize: 5 };

  constructor() { }

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
    this.service.users().subscribe({
      next: (response: AppUser[]) => {
        this.UserList = response;
        this.extractUniqueRoles();
        this.applyFilters();
        this.isLoading = false;
        console.log('Users loaded:', response);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: string): void {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      // TODO: Implement delete functionality when available in AuthService
      console.log('Delete user:', id);
      // this.service.deleteUser(id).subscribe({
      //   next: () => {
      //     this.UserList = this.UserList.filter(user => user.id !== id);
      //     this.applyFilters();
      //   },
      //   error: (error) => {
      //     console.error('Error deleting user:', error);
      //   }
      // });
    }
  }

  // Statistics methods
  getTotalUsers(): number {
    return this.UserList?.length || 0;
  }

  getAdminUsers(): number {
    return this.UserList?.filter(user =>
      user.role?.some(role => role.toLowerCase().includes('admin'))
    ).length || 0;
  }

  getTeacherUsers(): number {
    return this.UserList?.filter(user =>
      user.role?.some(role => role.toLowerCase().includes('teacher'))
    ).length || 0;
  }

  getActiveUsers(): number {
    // For now, assume all users are active since we don't have status field
    return this.UserList?.length || 0;
  }

  // Extract unique roles for filtering
  private extractUniqueRoles(): void {
    const rolesSet = new Set<string>();
    this.UserList?.forEach(user => {
      user.role?.forEach(role => {
        rolesSet.add(role);
      });
    });
    this.uniqueRoles = Array.from(rolesSet).sort();
  }

  // Search and filtering
  performSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...(this.UserList || [])];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.userName.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower) ||
        user.role?.some(role => role.toLowerCase().includes(searchLower))
      );
    }

    // Apply role filter
    if (this.selectedRole.trim()) {
      filtered = filtered.filter(user =>
        user.role?.includes(this.selectedRole)
      );
    }

    this.filteredUsers = filtered;
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  getFilteredUsers(): AppUser[] {
    return this.filteredUsers || [];
  }

  // Pagination methods
  getPaginatedUsers(): AppUser[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.getFilteredUsers().slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredUsers().length / this.pageSize);
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
    if (this.getFilteredUsers().length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getPaginationEnd(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.getFilteredUsers().length);
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
    // Reset pagination when changing view mode since card and table might have different page sizes
    this.currentPage = 1;
  }

  // Export functionality
  exportUsers(): void {
    if (!this.UserList || this.UserList.length === 0) {
      return;
    }

    // Create CSV data
    const csvData = this.convertUsersToCSV(this.getFilteredUsers());

    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertUsersToCSV(users: AppUser[]): string {
    const headers = [
      'User ID',
      'Username',
      'Roles',
      'Role Count'
    ];

    const rows: string[] = [headers.join(',')];

    users.forEach(user => {
      const row = [
        user.id,
        `"${user.userName}"`,
        `"${user.role?.join('; ') || 'No roles'}"`,
        (user.role?.length || 0).toString()
      ];
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  // TrackBy functions for performance
  trackByUserId(index: number, user: AppUser): string {
    return user.id;
  }
}
