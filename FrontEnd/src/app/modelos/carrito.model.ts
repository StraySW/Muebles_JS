export interface ProductoCarrito {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Carrito {
  id: number;
  products: ProductoCarrito[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface RespuestaCarritos {
  carts: Carrito[];
  total: number;
  skip: number;
  limit: number;
}