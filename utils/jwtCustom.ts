import { JwtPayload } from "jwt-decode";


export interface CustomJWT extends JwtPayload {
    user_id: string;
    phoneNum: string;
    email: string;
    roles: string;
    id:any;
  }