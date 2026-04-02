export interface PostRoot {
  isSuccess: boolean;
  data: CursorBaseDTO;
  successMessage: string;
  errorMessage: string;
  status: number;
}

export interface CursorBaseDTO {
  items: PostItem[];
  hasMore: boolean;
  nextCursor: string;
}

export interface PostItem {
  id: string;
  caption: string;
  content: string;
  authorUsername: string;
  authorAvatarUrl: string;
  visibility: string;
  carDto: CarDto;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  viewCount: number;
}

export interface CarDto {
  id: string;
  title: string;
  description: string;
  model: string;
  make: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  seatingCapacity: number;
  engineCapacity: number;
  carImages: CarImageDTO[];
  fuelType: string;
  carCondition: string;
  transmissionType: string;
  carStatus: string;
  carValidationStatus: string;
  vin: string;
  licensePlate: string;
}

export interface CarImageDTO {
  id: string;
  carId: string;
  url: string;
}

export interface CreatePostData {
  caption: string;
  content: string;
  visibility: "Default" | "Public" | "Private";
  carId: string;
}
