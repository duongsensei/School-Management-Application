export class RegistrationRequest {
  email = '';
  username = '';
  password = '';
  role?: string[] = []; // Assuming role is optional and an array of strings
}
