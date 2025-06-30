import { Component, OnInit } from '@angular/core';
import { Subject } from '../../../Models/subject';
import { SubjectService } from '../../../Services/subject.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.css'
})
export class SubjectListComponent implements OnInit {

  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  paginatedSubjects: Subject[] = [];
  standardId!: number;

  // Search and pagination properties
  searchTerm = '';
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private subjectService: SubjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSubjects();
  }

  getSubjects(): void {
    this.isLoading = true;
    this.subjectService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.filteredSubjects = [...this.subjects];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.isLoading = false;
      }
    });
  }

  deleteSubject(id: number): void {
    if (confirm("Are you sure you want to delete this subject?")) {
      this.subjectService.deleteSubject(id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(subject => subject.subjectId !== id);
          this.onSearch(this.searchTerm); // Refresh filtered results
        },
        error: (error) => {
          console.error('Error deleting subject:', error);
        }
      });
    }
  }

  // Search functionality
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.currentPage = 1;

    if (!this.subjects || this.subjects.length === 0) {
      this.filteredSubjects = [];
      this.updatePagination();
      return;
    }

    if (!this.searchTerm) {
      this.filteredSubjects = [...this.subjects];
    } else {
      this.filteredSubjects = this.subjects.filter(subject =>
        (subject.subjectName && subject.subjectName.toLowerCase().includes(this.searchTerm)) ||
        (subject.subjectCode && subject.subjectCode.toString().toLowerCase().includes(this.searchTerm)) ||
        (subject.standard?.standardName && subject.standard.standardName.toLowerCase().includes(this.searchTerm))
      );
    }

    this.updatePagination();
  }

  // Pagination functionality
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSubjects.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSubjects = this.filteredSubjects.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Statistics helper methods
  getActiveSubjects(): number {
    return this.subjects.length || 0; // Assuming all subjects are active for now
  }

  getUniqueStandards(): number {
    if (!this.subjects || this.subjects.length === 0) return 0;
    const uniqueStandards = new Set(
      this.subjects
        .filter(subject => subject.standard && subject.standard.standardName)
        .map(subject => subject.standard!.standardName)
    );
    return uniqueStandards.size;
  }

  // Utility methods
  refreshData(): void {
    this.getSubjects();
  }

  exportData(): void {
    // Implement export functionality
    console.log('Export functionality to be implemented');
  }

  // Math helper for template
  Math = Math;
}
