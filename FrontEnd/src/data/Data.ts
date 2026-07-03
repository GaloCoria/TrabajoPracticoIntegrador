import type { Product } from "../types/product";
import type { ICategory } from "../types/categoria";
  
const categorias: ICategory[] = [
  { id: 1, eliminado: false, createdAt: "2024-01-15T10:00:00", nombre: "Pizzas", descripcion: "Pizzas artesanales con masa fresca" },
  { id: 2, eliminado: false, createdAt: "2024-01-15T10:05:00", nombre: "Hamburguesas", descripcion: "Hamburguesas gourmet con ingredientes frescos" },
  { id: 3, eliminado: false, createdAt: "2024-01-16T09:00:00", nombre: "Bebidas", descripcion: "Gaseosas, jugos y bebidas frías" },
  { id: 4, eliminado: false, createdAt: "2024-01-16T09:30:00", nombre: "Postres", descripcion: "Tortas, helados y dulces artesanales" },
  { id: 5, eliminado: false, createdAt: "2024-01-17T08:00:00", nombre: "Empanadas", descripcion: "Empanadas horneadas y fritas de distintos sabores" },
  { id: 6, eliminado: false, createdAt: "2024-01-17T08:30:00", nombre: "Ensaladas", descripcion: "Ensaladas frescas y saludables" },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    eliminado: false,
    createdAt: "2024-02-01T08:00:00",
    nombre: "Pizza Muzzarella",
    precio: 4500.0,
    descripcion: "Pizza clásica con salsa de tomate y muzzarella derretida",
    stock: 20,
    imagen: "pizza.jpg",
    disponible: true,
    categorias: [categorias[0]],
  },
  {
    id: 4,
    eliminado: false,
    createdAt: "2024-02-02T09:30:00",
    nombre: "Hamburguesa Clásica",
    precio: 3800.0,
    descripcion: "Medallón de carne, lechuga, tomate, cebolla y mayo",
    stock: 30,
    imagen: "hamburguesa.jpg", 
    disponible: true,
    categorias: [categorias[1]],
  },
  
  {
    id: 20,
    eliminado: false,
    createdAt: "2024-02-10T09:00:00",
    nombre: "Ensalada Mixta",
    precio: 2400.0,
    descripcion: "Lechuga, tomate, zanahoria rallada y aceitunas",
    stock: 25,
    imagen: "ensalada.jpg",
    disponible: true,
    categorias: [categorias[5]],
  },
];


export function getCategories(): ICategory[] {
  return categorias.filter((c) => !c.eliminado);
}