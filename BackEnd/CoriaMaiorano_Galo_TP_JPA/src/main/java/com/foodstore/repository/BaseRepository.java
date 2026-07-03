package com.foodstore.repository;

import com.foodstore.Model.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<E extends Base, ID> extends JpaRepository<E, ID> {
}