import { Component, OnInit, HostListener } from '@angular/core';
import { CommonServices } from '../../../Services/common.service';
import { Standard } from '../../../Models/standard';
import { Student } from '../../../Models/student';
import { MonthlyPayment } from '../../../Models/monthly-payment';
import { OthersPayment } from '../../../Models/other-payment';
import { DueBalance } from '../../../Models/due-balance';

@Component({
  selector: 'app-payment-details-per-student',
  templateUrl: './payment-details-per-student.component.html',
  styleUrl: './payment-details-per-student.component.css'
})
export class PaymentDetailsPerStudentComponent implements OnInit {
  payments: MonthlyPayment[] = [];
  otherPayment: OthersPayment[] = [];
  dueBalance!: DueBalance;
  studentId!: number;
  public students: Student[] = [];
  public standards: Standard[] = [];
  filteredStudents: Student[] = [];
  public selectedStandardId = '';
  paymentDetails: any[] = [];

  // Header scroll state
  isHeaderScrolled = false;

  constructor(private commonService: CommonServices) { }

  ngOnInit(): void {
    // Fetch the standards and students data when the component initializes
    this.fetchStandards();
    this.fetchStudents();
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

  onSubmit(): void {
    // Perform any action on form submission, such as fetching payments
    this.getPaymentsByStudentId();
    this.getOtherPaymentByStudentId();
    this.geDueBalanceByStudentId();
    this.getfeePaymentByStudentId();
  }

  onStandardChange(): void {
    // Filter students based on the selected standard
    if (this.selectedStandardId) {
      this.filteredStudents = this.students.filter(student => student.standardId === parseInt(this.selectedStandardId));
    } else {
      // If no standard is selected, show all students
      this.filteredStudents = this.students;
    }
  }

  fetchStandards(): void {
    this.commonService.getAllStandards().subscribe({
      next: (data: Standard[]) => {
        this.standards = data;
      },
      error: (error) => {
        console.error('Error occurred while fetching standards:', error);
      }
    });
  }

  fetchStudents(): void {
    this.commonService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.filteredStudents = data; // Initially, show all students
      },
      error: (error) => {
        console.error('Error occurred while fetching students:', error);
      }
    });
  }

  getPaymentsByStudentId(): void {
    if (this.studentId) {
      this.commonService.getAllPaymentsByStudentId(this.studentId)
        .subscribe(payments => this.payments = payments);
    } else {
      console.error("Student ID is not set.");
    }
  }

  getOtherPaymentByStudentId(): void {
    if (this.studentId) {
      this.commonService.getAllOtherPaymentsByStudentId(this.studentId)
        .subscribe(otherpayments => this.otherPayment = otherpayments);
    } else {
      console.error("Student ID is not set.");
    }
  }

  geDueBalanceByStudentId(): void {
    if (this.studentId) {
      this.commonService.getDueBalance(this.studentId)
        .subscribe(dueBalance => this.dueBalance = dueBalance);
    } else {
      console.error("Student ID is not set.");
    }
  }

  getfeePaymentByStudentId(): void {
    if (this.studentId) {
      this.commonService.getfeePaymentDetailsByStudentId(this.studentId)
        .subscribe(paymentDetails => this.paymentDetails = paymentDetails);
    } else {
      console.error("Student ID is not set.");
    }
  }

  // Payment status classification methods for Monthly Payments
  getPaymentStatus(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'Fully Paid';
    } else if (payment.amountPaid > 0) {
      return 'Partially Paid';
    } else {
      return 'Pending';
    }
  }

  getPaymentStatusClass(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'paid';
    } else if (payment.amountPaid > 0) {
      return 'partial';
    } else {
      return 'pending';
    }
  }

  getPaymentStatusIcon(payment: MonthlyPayment): string {
    if (payment.amountRemaining === 0) {
      return 'check_circle';
    } else if (payment.amountPaid > 0) {
      return 'hourglass_empty';
    } else {
      return 'schedule';
    }
  }

  // Payment status classification methods for Other Payments
  getOtherPaymentStatus(payment: OthersPayment): string {
    if (payment.amountRemaining === 0) {
      return 'Fully Paid';
    } else if (payment.amountPaid > 0) {
      return 'Partially Paid';
    } else {
      return 'Pending';
    }
  }

  getOtherPaymentStatusClass(payment: OthersPayment): string {
    if (payment.amountRemaining === 0) {
      return 'paid';
    } else if (payment.amountPaid > 0) {
      return 'partial';
    } else {
      return 'pending';
    }
  }

  getOtherPaymentStatusIcon(payment: OthersPayment): string {
    if (payment.amountRemaining === 0) {
      return 'check_circle';
    } else if (payment.amountPaid > 0) {
      return 'hourglass_empty';
    } else {
      return 'schedule';
    }
  }
}
