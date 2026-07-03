import type { ICategory } from "./categoria";

export interface Product {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string;
    categorias: ICategory[]; 
    stock: number;
    disponible: boolean;
    eliminado: boolean;
    createdAt: string;
}


export interface CartItem extends Product {
    cantidad: number;
}