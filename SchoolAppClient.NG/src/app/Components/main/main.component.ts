import { Component, OnInit, inject } from '@angular/core';
import { CommonServices } from '../../Services/common.service';
import { AuthService } from '../../Authentication/SecurityModels/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  isSidebarVisible = true;
  
  // Services
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private sidebarService: CommonServices) { }

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authService.userValue != null;
  }

  // Check if current route is authentication-related
  isAuthRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/login') || 
           currentUrl.includes('/register') || 
           currentUrl.includes('/forgot-password');
  }

  // Determine whether to show the main layout (header + sidebar)
  shouldShowMainLayout(): boolean {
    return this.isAuthenticated() && !this.isAuthRoute();
  }
}
