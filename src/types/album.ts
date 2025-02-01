export interface ImageItem {
  title: string;
  url: string;
}

export interface Album {
  id: string;
  name: string;
  date: string;
  description: string;
  coverImage: string;
  images: ImageItem[]; 
}