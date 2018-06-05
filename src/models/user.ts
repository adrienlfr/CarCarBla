export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  photoUrl: string;
  isDriver: boolean;
}

export const USER_PATH = 'Users';
