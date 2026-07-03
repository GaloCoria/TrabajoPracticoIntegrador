package com.foodstore.repository;

import com.foodstore.Model.Usuario;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {

    
    Optional<Usuario> findByMail(String mail);
}