export type TActivity = {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  category?: {
    name: string;
  };
  startedAt: string;
  endedAt: string;
  status: "NOT_COMPLETED" | "COMPLETED" | "CANCELED";
};

export type TCreateActivityRequest = {
  name: string;
  description: string;
  categoryId: number;
  startedAt: string;
  endedAt: string;
};

export type TUpdateActivityRequest = {
  id: number;
  name?: string;
  description?: string;
  categoryId?: number;
  status?: "NOT_COMPLETED" | "COMPLETED" | "CANCELED";
  startedAt?: string;
  endedAt?: string;
};

export type TCategory = {
  id: number;
  name: string;
};
