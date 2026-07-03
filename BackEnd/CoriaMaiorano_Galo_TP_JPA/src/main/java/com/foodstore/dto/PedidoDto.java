package com.foodstore.dto;

import com.foodstore.Enums.FormaPago;
import java.util.List;

public record PedidoDto(
        Long usuarioId,
        FormaPago formaPago,
        List<DetallePedidoDto> detalles
) {}


