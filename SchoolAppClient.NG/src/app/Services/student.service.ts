import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../Models/student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:5257/api/Students";

  public GetStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  public GetStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }



  public SaveStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  public UpdateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.studentId}`, student);
  }

  public DeleteStudent(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
