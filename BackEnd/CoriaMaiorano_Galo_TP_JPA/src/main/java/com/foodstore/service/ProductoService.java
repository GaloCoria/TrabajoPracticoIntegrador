package com.foodstore.service;

import com.foodstore.Model.Categoria;
import com.foodstore.Model.Producto;
import com.foodstore.dto.CategoriaDto;
import com.foodstore.dto.ProductoDto;
import com.foodstore.repository.CategoriaRepository;
import com.foodstore.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private ProductoDto convertirADto(Producto p) {
        CategoriaDto catDto = new CategoriaDto(p.getCategoria().getId(), p.getCategoria().getNombre(), p.getCategoria().getDescripcion());
        return new ProductoDto(p.getId(), p.getNombre(), p.getPrecio(), p.getDescripcion(), p.getStock(), p.getImagen(), p.getDisponible(), catDto);
    }

    public List<ProductoDto> listarTodos() {
        return productoRepository.findAll().stream()
                .filter(p -> !p.isEliminado())
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    public ProductoDto guardar(Producto producto) {

        Categoria categoriaDB = categoriaRepository.findById(producto.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));


        producto.setCategoria(categoriaDB);


        return convertirADto(productoRepository.save(producto));
    }

    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setEliminado(true);
        productoRepository.save(producto);
    }
    public ProductoDto buscarPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));


        if (producto.isEliminado()) {
            throw new RuntimeException("Producto no encontrado");
        }

        return convertirADto(producto);
    }
    public ProductoDto actualizar(Long id, Producto productoActualizado) {

        Producto productoDB = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (productoDB.isEliminado()) {
            throw new RuntimeException("El producto se encuentra eliminado");
        }

        
        if (productoActualizado.getNombre() != null) productoDB.setNombre(productoActualizado.getNombre());
        if (productoActualizado.getPrecio() != null) productoDB.setPrecio(productoActualizado.getPrecio());
        if (productoActualizado.getDescripcion() != null) productoDB.setDescripcion(productoActualizado.getDescripcion());
        if (productoActualizado.getStock() != null) productoDB.setStock(productoActualizado.getStock());
        if (productoActualizado.getImagen() != null) productoDB.setImagen(productoActualizado.getImagen());
        if (productoActualizado.getDisponible() != null) productoDB.setDisponible(productoActualizado.getDisponible());


        if (productoActualizado.getCategoria() != null && productoActualizado.getCategoria().getId() != null) {
            Categoria categoriaDB = categoriaRepository.findById(productoActualizado.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("La categoría asignada no existe"));
            productoDB.setCategoria(categoriaDB);
        }


        Producto guardado = productoRepository.save(productoDB);
        return convertirADto(guardado);
    }
    public List<ProductoDto> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
                .filter(p -> !p.isEliminado())
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }
}