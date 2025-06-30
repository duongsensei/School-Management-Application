import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { Student } from '../../../Models/student';
import { Standard } from '../../../Models/standard';
import { StudentService } from '../../../Services/student.service';
import { StandardService } from '../../../Services/standard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.css'
})
export class StudentAddComponent implements OnInit {

  @ViewChild("studentForm") studentForm!: NgForm;

  students: Student = new Student();
  standards: Standard[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private standardService: StandardService,
    private router: Router,
    private location: Location
  ) { }



  ngOnInit(): void {
    this.initializeForm();
    this.loadStandards();
  }

  initializeForm(): void {
    // Initialize form if needed
  }

  loadStandards(): void {
    this.standardService.getStandards().subscribe({
      next: (standards: Standard[]) => {
        this.standards = standards;
      },
      error: (error) => {
        console.error('Error loading standards:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      // Clean up data before sending
      this.cleanStudentData();

      console.log('Submitting student data:', this.students);

      this.studentService.SaveStudent(this.students).subscribe({
        next: (response) => {
          console.log('Student added successfully', response);
          alert('Student added successfully!');
          this.router.navigate(['/student']);
        },
        error: (error) => {
          console.error('Error adding student:', error);

          // Show more specific error messages
          if (error.status === 400) {
            if (error.error) {
              alert(`Validation Error: ${JSON.stringify(error.error)}`);
            } else {
              alert('Bad Request: Please check your form data.');
            }
          } else if (error.status === 401) {
            alert('Unauthorized: Please login with Admin or Operator role.');
          } else if (error.status === 403) {
            alert('Forbidden: You need Admin or Operator role to add students.');
          } else {
            alert('Error adding student. Please try again.');
          }
        }
      });
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
      alert('Please fill in all required fields correctly.');
    }
  }

  private cleanStudentData(): void {
    // Clean NID fields - remove if empty or make them null
    if (!this.students.studentNIDNumber || this.students.studentNIDNumber.trim() === '') {
      this.students.studentNIDNumber = null;
    }
    if (!this.students.fatherNID || this.students.fatherNID.trim() === '') {
      this.students.fatherNID = null;
    }
    if (!this.students.motherNID || this.students.motherNID.trim() === '') {
      this.students.motherNID = null;
    }

    // Ensure required numeric fields are proper numbers
    if (this.students.admissionNo) {
      this.students.admissionNo = Number(this.students.admissionNo);
    }
    if (this.students.enrollmentNo) {
      this.students.enrollmentNo = Number(this.students.enrollmentNo);
    }
    if (this.students.uniqueStudentAttendanceNumber) {
      this.students.uniqueStudentAttendanceNumber = Number(this.students.uniqueStudentAttendanceNumber);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.controls[key];
      control.markAsTouched();
    });
  }





  uploadImage(imageInput: any): void {
    if (!imageInput.files || imageInput.files.length === 0) {
      return;
    }

    const file: File = imageInput.files[0];
    if (file.size > 200 * 1024) {
      alert('Maximum allowed size is 200KB');
      return;
    }

    this.students.imageUpload.getBase64(file);
  }

  goBack(): void {
    this.location.back();
  }
}

