package com.foodstore.service;

import com.foodstore.Model.Usuario;
import com.foodstore.dto.UsuarioDto;
import com.foodstore.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    public List<UsuarioDto> listarTodos() {
        return usuarioRepository.findAll().stream()
                .filter(u -> !u.isEliminado()) // Filtramos los que tienen borrado lógico
                .map(u -> new UsuarioDto(u.getId(), u.getNombre(), u.getApellido(), u.getMail(), u.getCelular(), u.getRol()))
                .collect(Collectors.toList());
    }

    
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setEliminado(true); // Hacemos el borrado lógico
        usuarioRepository.save(usuario);
    }


    public UsuarioDto actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuarioDB = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        if (usuarioActualizado.getNombre() != null) usuarioDB.setNombre(usuarioActualizado.getNombre());
        if (usuarioActualizado.getApellido() != null) usuarioDB.setApellido(usuarioActualizado.getApellido());
        if (usuarioActualizado.getCelular() != null) usuarioDB.setCelular(usuarioActualizado.getCelular());

        Usuario guardado = usuarioRepository.save(usuarioDB);

        return new UsuarioDto(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getApellido(),
                guardado.getMail(),
                guardado.getCelular(),
                guardado.getRol()
        );
    }

    public UsuarioDto convertirADto(Usuario u) {
       
        return new UsuarioDto(
                u.getId(),
                u.getNombre(),
                u.getApellido(),
                u.getMail(),
                u.getCelular(),
                u.getRol()
        );
    }
}