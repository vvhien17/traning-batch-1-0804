export class IUser {
  id: number;
  email: string;
  username: string;
}

export class ILoginResponse {
  user: IUser;
  access_token: string;
}
