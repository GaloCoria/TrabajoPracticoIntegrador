package com.foodstore.dto;

public record DetalleRespuestaDto(
        int cantidad,
        Double subtotal,
        String nombreProducto
) {}