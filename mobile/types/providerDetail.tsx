export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
