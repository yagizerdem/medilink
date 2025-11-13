import { Gender } from "../enums/gender";

export interface Patient {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  age: number;
}
