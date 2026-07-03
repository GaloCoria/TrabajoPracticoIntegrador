package com.foodstore.repository;

import com.foodstore.Model.Categoria;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends BaseRepository<Categoria, Long> {
}