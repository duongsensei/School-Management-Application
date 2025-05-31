import { Component, OnInit } from '@angular/core';
import { Standard } from '../../../Models/standard';
import { StandardService } from '../../../Services/standard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-standard-list',
  templateUrl: './standard-list.component.html',
  styleUrl: './standard-list.component.css'
})
export class StandardListComponent implements OnInit {

  standard: Standard[] = [];
  filteredStandards: Standard[] = [];
  paginatedStandards: Standard[] = [];
  standardId!: number;

  // Search and pagination properties
  searchTerm = '';
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private standarService: StandardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getStandards();
  }

  getStandards(): void {
    this.isLoading = true;
    this.standarService.getStandards().subscribe({
      next: (data) => {
        this.standard = data;
        this.filteredStandards = [...this.standard];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading standards:', error);
        this.isLoading = false;
      }
    });
  }

  deleteStandard(id: number): void {
    if (confirm("Are you sure you want to delete this class/standard?")) {
      this.standarService.deleteStandard(id).subscribe({
        next: () => {
          this.standard = this.standard.filter(standard => standard.standardId !== id);
          this.onSearch(this.searchTerm); // Refresh filtered results
        },
        error: (error) => {
          console.error('Error deleting standard:', error);
        }
      });
    }
  }

  // Search functionality
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.currentPage = 1;

    if (!this.standard || this.standard.length === 0) {
      this.filteredStandards = [];
      this.updatePagination();
      return;
    }

    if (!this.searchTerm) {
      this.filteredStandards = [...this.standard];
    } else {
      this.filteredStandards = this.standard.filter(std =>
        (std.standardName && std.standardName.toLowerCase().includes(this.searchTerm)) ||
        (std.standardCapacity && std.standardCapacity.toString().toLowerCase().includes(this.searchTerm))
      );
    }

    this.updatePagination();
  }

  // Pagination functionality
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStandards.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStandards = this.filteredStandards.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Statistics helper methods
  getTotalStudents(): number {
    if (!this.standard || this.standard.length === 0) return 0;
    return this.standard.reduce((total, std) => total + (std.students?.length || 0), 0);
  }

  getTotalSubjects(): number {
    if (!this.standard || this.standard.length === 0) return 0;
    return this.standard.reduce((total, std) => total + (std.subjects?.length || 0), 0);
  }

  getTotalCapacity(): number {
    if (!this.standard || this.standard.length === 0) return 0;
    return this.standard.reduce((total, std) => {
      const capacity = parseInt(std.standardCapacity) || 0;
      return total + capacity;
    }, 0);
  }

  // Utilization calculation
  getUtilizationPercentage(std: Standard): number {
    if (!std.standardCapacity || !std.students) return 0;
    const capacity = parseInt(std.standardCapacity) || 0;
    const studentCount = std.students.length || 0;
    if (capacity === 0) return 0;
    return Math.round((studentCount / capacity) * 100);
  }

  // View standard details
  viewStandardDetails(std: Standard): void {
    // Navigate to standard details page or show modal
    console.log('View standard details:', std);
    // You can implement navigation to a details page here
    // this.router.navigate(['/standard', std.standardId, 'details']);
  }

  // Utility methods
  refreshData(): void {
    this.getStandards();
  }

  exportData(): void {
    // Implement export functionality
    console.log('Export functionality to be implemented');
  }

  // Math helper for template
  Math = Math;
}
