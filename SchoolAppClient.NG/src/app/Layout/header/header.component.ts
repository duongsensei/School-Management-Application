import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../Authentication/SecurityModels/auth.service';
import { AuthResponse } from '../../Authentication/SecurityModels/auth-response';
import { CommonServices } from '../../Services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'School Management System';
  private authService = inject(AuthService);
  user!: AuthResponse;
  public login!: boolean;
  public showUserMenu = false;
  public activeDropdown = '';
  public searchQuery = '';

  private clickOutsideListener: (event: Event) => void;

  constructor(private sidebarService: CommonServices) {
    // Bind click outside listener
    this.clickOutsideListener = this.onClickOutside.bind(this);
  }

  ngOnInit() {
    this.login = this.authService.isLoggedIn;
    this.user = this.authService.getCurrentAuthUser;

    // Add click outside listener
    document.addEventListener('click', this.clickOutsideListener);
  }

  ngOnDestroy() {
    // Remove click outside listener
    document.removeEventListener('click', this.clickOutsideListener);
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    // Close navigation dropdowns when user menu opens
    if (this.showUserMenu) {
      this.activeDropdown = '';
    }
  }

  toggleDropdown(dropdown: string) {
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = '';
    } else {
      this.activeDropdown = dropdown;
      // Close user menu when navigation dropdown opens
      this.showUserMenu = false;
    }
  }

  closeAllDropdowns() {
    this.activeDropdown = '';
    this.showUserMenu = false;
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value;
    // Implement search functionality here
  }

  onSearchFocus() {
    // Close all dropdowns when search is focused
    this.closeAllDropdowns();
  }

  onSearchBlur() {
    // Handle search blur if needed
  }

  onAvatarError(event: any) {
    event.target.style.display = 'none';
    if (event.target.nextElementSibling) {
      event.target.nextElementSibling.style.display = 'flex';
    }
  }

  getUserAvatar(): string {
    // Since AuthResponse doesn't have avatar property, use a default avatar
    return 'assets/images/default-avatar.svg';
  }

  private onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Check if click is outside header components
    if (!target.closest('.user-dropdown') &&
      !target.closest('.nav-item') &&
      !target.closest('.search-container')) {
      this.closeAllDropdowns();
    }
  }

  logout() {
    this.authService.logout();
  }

  refreshToken() {
    this.authService.refreshToken()?.subscribe(() => { });
  }
}
