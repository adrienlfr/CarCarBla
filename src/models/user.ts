import {Journey} from "./journey";

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  photoUrl: string;
  journeys: [Journey];
}

export const USER_PATH = 'Users';
export const JOURNEYS_PATH = 'Journeys';
