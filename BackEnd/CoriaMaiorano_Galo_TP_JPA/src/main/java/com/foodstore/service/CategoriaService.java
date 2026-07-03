package com.foodstore.service;

import com.foodstore.Model.Categoria;
import com.foodstore.dto.CategoriaDto;
import com.foodstore.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Convertir de Entidad a DTO
    private CategoriaDto convertirADto(Categoria categoria) {
        return new CategoriaDto(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
    }

    public List<CategoriaDto> listarTodas() {
        return categoriaRepository.findAll().stream()
                .filter(c -> !c.isEliminado()) // Filtramos las eliminadas lógicamente
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    public CategoriaDto buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        if(categoria.isEliminado()) throw new RuntimeException("La categoría fue eliminada");
        return convertirADto(categoria);
    }

    public CategoriaDto guardar(Categoria categoria) {
        Categoria guardada = categoriaRepository.save(categoria);
        return convertirADto(guardada);
    }

    public CategoriaDto actualizar(Long id, Categoria categoriaActualizada) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        if (categoriaActualizada.getNombre() != null) categoria.setNombre(categoriaActualizada.getNombre());
        if (categoriaActualizada.getDescripcion() != null) categoria.setDescripcion(categoriaActualizada.getDescripcion());

        return convertirADto(categoriaRepository.save(categoria));
    }

    public void eliminar(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoria.setEliminado(true); // Soft Delete
        categoriaRepository.save(categoria);
    }
}