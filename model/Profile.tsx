import { UserType } from "../enums/userType";

export interface Profile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  type: UserType;
}
