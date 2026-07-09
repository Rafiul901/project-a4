export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
}

export interface LoginUser {
  email: string;
  password: string;
}
