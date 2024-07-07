export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  photoURL: PhotoURL;
}

export interface PhotoURL {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    small: ImageFormat;
    xsmall: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => void;
  logout: () => void;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export interface RefreshTokenResponse {
  jwt: string;
}

export type FinancialFigure = {
  id: number;
  attributes: {
    yearPeriod: number;
    monthPeriod: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type FinancialFiguresResponse = {
  data: FinancialFigure[];
};
