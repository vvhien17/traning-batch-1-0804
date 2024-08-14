export type TLoginRequest = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  username: string;
};
