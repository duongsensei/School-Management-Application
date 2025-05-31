import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../Authentication/SecurityModels/auth.service';
import { AuthResponse } from '../../Authentication/SecurityModels/auth-response';
import { CommonServices } from '../../Services/common.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'Hệ Thống Quản Lý Trường Học Đại Dương';
  private authService = inject(AuthService);
  user!: AuthResponse;
  public login!: boolean;
  public isMobileMenuOpen = false;
  public isMobileSearchOpen = false;
  public showSearchSuggestions = false;
  public showNotifications = false;
  public showUserMenu = false;
  public notificationCount = 3;
  public messageCount = 5;

  // Sample notifications data
  public notifications: Notification[] = [
    {
      id: '1',
      title: 'Học sinh mới đăng ký',
      message: 'Có 5 học sinh mới đăng ký khóa học hôm nay',
      time: '2 phút trước',
      icon: 'person_add',
      color: '#14b8a6',
      read: false
    },
    {
      id: '2',
      title: 'Báo cáo điểm danh',
      message: 'Báo cáo điểm danh tuần này đã sẵn sàng',
      time: '15 phút trước',
      icon: 'assessment',
      color: '#3b82f6',
      read: false
    },
    {
      id: '3',
      title: 'Thanh toán học phí',
      message: 'Học phí tháng 12 đã được thanh toán thành công',
      time: '1 giờ trước',
      icon: 'payment',
      color: '#10b981',
      read: false
    }
  ];

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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close other overlays
    if (this.isMobileSearchOpen) {
      this.isMobileSearchOpen = false;
    }
    this.closeAllDropdowns();
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    // Close other overlays
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    this.closeAllDropdowns();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    // Close other dropdowns
    this.showUserMenu = false;
    this.showSearchSuggestions = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    // Close other dropdowns
    this.showNotifications = false;
    this.showSearchSuggestions = false;
  }

  onSearchFocus() {
    this.showSearchSuggestions = true;
    // Close other dropdowns
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSearchSuggestions = false;
    }, 200);
  }

  clearSearch(searchInput: HTMLInputElement) {
    searchInput.value = '';
    searchInput.focus();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
    this.showNotifications = false;
  }

  private closeAllDropdowns() {
    this.showNotifications = false;
    this.showUserMenu = false;
    this.showSearchSuggestions = false;
  }

  private onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Check if click is outside dropdowns
    if (!target.closest('.notification-dropdown') &&
      !target.closest('.user-dropdown') &&
      !target.closest('.search-container')) {
      this.closeAllDropdowns();
    }
  }

  getLastLoginTime(): string {
    // Mock last login time - in real app, this would come from user data
    const now = new Date();
    const lastLogin = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // 2 hours ago
    return lastLogin.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout() {
    this.authService.logout();
  }

  refreshToken() {
    this.authService.refreshToken()?.subscribe(() => { });
  }
}
