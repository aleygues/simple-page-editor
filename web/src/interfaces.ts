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
  currentVersion: Version;
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
  createdAt: string;
  createdBy: User;
}
