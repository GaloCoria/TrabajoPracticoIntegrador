package com.foodstore.dto;

public record ProductoDto(
        Long id,
        String nombre,
        Double precio,
        String descripcion,
        Integer stock,
        String imagen,
        Boolean disponible,
        CategoriaDto categoria
) {}