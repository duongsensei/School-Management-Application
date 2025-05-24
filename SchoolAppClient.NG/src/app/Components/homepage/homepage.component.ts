import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  
  isScrolled = false;
  animateStats = false;

  // Statistics to animate
  stats = [
    { number: 1200, display: '1,200+', label: 'Active Students', suffix: '+' },
    { number: 85, display: '85', label: 'Expert Teachers', suffix: '' },
    { number: 15, display: '15', label: 'Departments', suffix: '' },
    { number: 98, display: '98%', label: 'Success Rate', suffix: '%' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Start stats animation after component loads
    setTimeout(() => {
      this.animateStats = true;
    }, 500);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 100;
  }

  // Handle keyboard navigation for feature cards - Fixed null safety
  onFeatureCardKeydown(event: KeyboardEvent, route: string): void {
    if (!event) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateTo(route);
    }
  }

  // Navigation methods
  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string): void {
    if (!sectionId) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
