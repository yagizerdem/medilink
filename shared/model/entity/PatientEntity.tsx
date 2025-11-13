import { Gender } from "../../../enums/gender";

export interface PatientEntity {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  age: number;
  pharmacistUid: string;
  phoneNumber: string;
}
