package com.foodstore.dto;

import com.foodstore.Enums.Estado;
import com.foodstore.Enums.FormaPago;
import java.time.LocalDate;
import java.util.List;

public record PedidoRespuestaDto(
        Long id,
        LocalDate fecha,
        Estado estado,
        Double total,
        FormaPago formaPago,
        List<DetalleRespuestaDto> detalles,
        String clienteNombre,
        String clienteMail    
) {}