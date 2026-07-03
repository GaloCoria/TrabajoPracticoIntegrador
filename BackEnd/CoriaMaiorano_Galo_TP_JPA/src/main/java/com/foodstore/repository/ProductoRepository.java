package com.foodstore.repository;

import com.foodstore.Model.Producto;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
}