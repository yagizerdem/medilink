import { UserType } from "../../../enums/userType";

export interface ProfileEntity {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  type: UserType;
}
