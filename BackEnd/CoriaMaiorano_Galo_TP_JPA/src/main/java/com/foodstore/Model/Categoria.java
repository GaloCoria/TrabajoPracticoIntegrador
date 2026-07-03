package com.foodstore.Model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Categoria extends Base {
    private String nombre;
    private String descripcion;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "categoria_id")
    private List<Producto> productos = new ArrayList<>();

    
}