import { Component, OnInit } from '@angular/core';
import { Student } from '../../../Models/student';
import { StudentService } from '../../../Services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class ListStudentComponent implements OnInit {

  public students: Student[] = [];
  public filteredStudents: Student[] = [];
  public paginatedStudents: Student[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';
  
  // Pagination properties
  public currentPage: number = 1;
  public pageSize: number = 15; // Table layout can show more items
  public totalPages: number = 1;
  
  // Math for template
  public Math = Math;

  constructor(private studentService: StudentService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.studentService.GetStudents().subscribe(
      students => {
        this.students = students;
        this.filteredStudents = [...students];
        this.updatePagination();
        this.isLoading = false;
      },
      (error) => {
        console.log('Observable emitted an error: ' + error);
        this.isLoading = false;
      }
    );
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.studentName?.toLowerCase().includes(this.searchTerm) ||
        student.admissionNo?.toString().toLowerCase().includes(this.searchTerm) ||
        student.enrollmentNo?.toString().toLowerCase().includes(this.searchTerm) ||
        student.standard?.standardName?.toLowerCase().includes(this.searchTerm)
      );
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getActiveStudents(): number {
    // Assuming students are active by default, or you can add a property to filter by active status
    // For now, returning all students as active
    return this.students.length || 0;
  }

  getUniqueStandards(): number {
    if (!this.students || this.students.length === 0) {
      return 0;
    }
    
    const uniqueStandards = new Set();
    this.students.forEach(student => {
      if (student.standard && student.standard.standardName) {
        uniqueStandards.add(student.standard.standardName);
      }
    });
    
    return uniqueStandards.size;
  }

  refreshData(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadData();
  }

  exportData(): void {
    // Create CSV content
    const headers = ['ID', 'Name', 'Admission No', 'Enrollment No', 'Date of Birth', 'Class'];
    const csvContent = [
      headers.join(','),
      ...this.filteredStudents.map(student => [
        student.studentId,
        `"${student.studentName || ''}"`,
        student.admissionNo || '',
        student.enrollmentNo || '',
        student.studentDOB ? new Date(student.studentDOB).toLocaleDateString('en-GB') : '',
        `"${student.standard?.standardName || ''}"`
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  deleteStudent(student: Student): void {
    const confirmDelete: boolean = confirm(`Are you sure you want to delete ${student.studentName}?`);
    if (confirmDelete) {
      this.studentService.DeleteStudent(student.studentId).subscribe(
        () => {
          this.loadData();
        },
        (error) => {
          console.log('Observable emitted an error: ' + error);
        }
      );
    }
  }
}

