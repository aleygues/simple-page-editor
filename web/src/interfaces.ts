export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  description: string;
  inSitemap: boolean;
  currentVersion: Version;
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  id: number;
  tag: string;
  currentVersion: Version;
  createdAt: string;
  createdBy: User;
}

export interface Version {
  id: number;
  content: string;
}

export interface Media {
  id: number;
  name: string;
  path: string;
  mimetype: string;
  createdAt: string;
  createdBy: User;
}
