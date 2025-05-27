import { Component, inject } from '@angular/core';
import { AuthService } from '../../Authentication/SecurityModels/auth.service';
import { AuthResponse } from '../../Authentication/SecurityModels/auth-response';
import { CommonServices } from '../../Services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title = 'NG.ClientsSchoolAPI';
  private authService = inject(AuthService);
  user!: AuthResponse;
  public login!: boolean;
  public isMobileMenuOpen = false;
  public isMobileSearchOpen = false;
  
  constructor(private sidebarService: CommonServices) { }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close mobile search if open
    if (this.isMobileSearchOpen) {
      this.isMobileSearchOpen = false;
    }
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  ngOnInit() {
    this.login = this.authService.isLoggedIn;
    this.user = this.authService.getCurrentAuthUser;
  }

  logout() {
    this.authService.logout();
  }

  refreshToken() {
    this.authService.refreshToken()?.subscribe(() => { });
  }
}
