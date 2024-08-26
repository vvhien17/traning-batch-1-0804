export type TActivity = {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  startedAt: string;
  endedAt: string;
};

export type TCreateActivityRequest = {
  name: string;
  description: string;
  category: string;
  startedAt: string;
  endedAt: string;
};

export type TUpdateActivityRequest = {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  startedAt?: string;
  endedAt?: string;
};
