export interface Tag {
  id: string;
  name: string;
  productsCount: number;
  status: "Active" | "Inactive";
  createdAt: string; // formatted date string e.g. "12 May"
}
