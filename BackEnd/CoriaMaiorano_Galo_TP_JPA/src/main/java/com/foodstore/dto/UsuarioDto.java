package com.foodstore.dto;

import com.foodstore.Enums.Rol;

public record UsuarioDto(
    Long id,
    String nombre,
    String apellido,
    String mail,
    String celular,
    Rol rol
) {}