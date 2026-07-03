package com.foodstore.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Producto extends Base {

    private String nombre;
    private String imagen;
    private String descripcion;
    private Boolean disponible;


    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;
}