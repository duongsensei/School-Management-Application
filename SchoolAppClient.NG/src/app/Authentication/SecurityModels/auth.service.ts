import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthRequest } from "./auth-request";
import { AppRole, AppUser, AuthResponse } from "./auth-response";
import { jwtDecode } from "jwt-decode";
import { RegistrationRequest } from "./RegistrationRequest";
import { AuthRegRequest } from "./AuthRegRequest";

const api = "http://localhost:5257/api/users/";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly JWT_USER = 'JWT_USER';
  private loggedUser?: string;
  private router = inject(Router);
  private http = inject(HttpClient);
  private isLogin = false;

  private userSubject = new BehaviorSubject<AuthResponse | null>(JSON.parse(localStorage.getItem(this.JWT_USER)!));
  public user: Observable<AuthResponse | null> = this.userSubject.asObservable();

  //constructor(@Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef) { }


  //constructor(private changeDetectorRef: ChangeDetectorRef) { }
  constructor(
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.JWT_USER)!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }


  login(user: AuthRequest): Observable<any> {
    return this.http
      .post<any>(api + 'login', user)
      .pipe(
        tap((response: any) => {
          console.info(response);
          if (response.success && response.data) {
            this.doLoginUser(response.data);
            this.userSubject.next(response.data);
          }
        })
      );
  }

  register(userNew: AuthRegRequest): Observable<any> {
    return this.http
      .post<any>(api + 'register', userNew);
  }
  roleEntry(role: AppRole): Observable<any> {

    if (role.id) {
      return this.http
        .put(api + 'edit-role', role);
    }
    else {
      return this.http
        .post(api + 'create-role', role);
    }

  }
  roleDelete(roleId: string): Observable<any> {

    return this.http
      .delete(api + 'delete-role/' + roleId);

  }
  private doLoginUser(data: AuthResponse) {
    this.loggedUser = data.email;
    this.storeJwtToken(data.token);
    this.storeUser(data);
  }
  private storeUser(user: AuthResponse) {
    localStorage.setItem(this.JWT_USER, JSON.stringify(user));
  }
  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.JWT_USER);
    this.userSubject.next(null);
    //this.router.navigate(['/login']);
    window.location.href = '/login';
  }

  get getCurrentAuthUser(): any {
    if (localStorage.getItem(this.JWT_USER)) {
      const user = JSON.parse(localStorage.getItem(this.JWT_USER) ?? "");
      return user;
    }
    return null;
  }

  //get isLoggedIn() {
  //  return this.isAuthenticatedSubject.asObservable() || !!localStorage.getItem(this.JWT_TOKEN);
  //}

  get isLoggedIn() {
    //this.isAuthenticatedSubject.asObservable().subscribe(data => {
    //  this.isLogin = data;
    //});

    //this.user.subscribe(x => this.user = x);
    return !!localStorage.getItem(this.JWT_TOKEN);
  }





  isTokenExpired() {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return true;
    const token = JSON.parse(tokens).access_token;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return expirationDate < now;
  }

  refreshToken() {
    let tokens: any = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return;
    tokens = JSON.parse(tokens);
    const refreshToken = tokens.refresh_token;
    return this.http
      .post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        refreshToken,
      })
      .pipe(tap((tokens: any) => this.storeJwtToken(JSON.stringify(tokens))));
  }



  users(): Observable<AppUser[]> {
    return this.http
      .get<AppUser[]>('http://localhost:5257/GetUsers');
  }


  roles(): Observable<AppRole[]> {
    return this.http
      .get<AppRole[]>('http://localhost:5257/GetRoles');
  }
  getUser(id: string): Observable<AppUser> {
    return this.http
      .get<AppUser>(api + "GetUser/" + id);
  }

  userAssignRole(data: AppUser): Observable<any> {
    return this.http
      .post(api + 'AssignRole', data);
  }

}
