export interface RawProduct {
  description: string;
  images: string[];
}

export interface Product {
  name: string;
  description: string;
  images: string[];
  price: string;
  basePrice: string;
  fullPrice: string;
  size: string;
  glass: string;
  material: string;
  wr: string;
}