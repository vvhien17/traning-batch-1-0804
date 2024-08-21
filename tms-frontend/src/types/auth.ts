export type TLoginRequest = {
  email: string;
  password: string;
};

export type TProfile = {
  id: number;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type TLoginResponse = {
  access_token: string;
  user: TProfile;
};

export type TRegisterRequest = {
  email: string;
  username: string;
  password: string;
};
