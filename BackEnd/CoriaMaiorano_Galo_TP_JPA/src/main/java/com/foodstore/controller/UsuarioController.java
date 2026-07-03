package com.foodstore.controller;

import com.foodstore.Model.Usuario;
import com.foodstore.dto.UsuarioDto;
import com.foodstore.dto.UsuarioRegistroDto;
import com.foodstore.repository.UsuarioRepository;
import com.foodstore.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String passwordPlana = credenciales.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getMail() != null && u.getMail().equals(email))
                .findFirst();

        if (usuarioOpt.isPresent()) {
            Usuario usuarioDB = usuarioOpt.get();

            if (passwordEncoder.matches(passwordPlana, usuarioDB.getContrasenia())) {
                return ResponseEntity.ok(usuarioService.convertirADto(usuarioDB));
            }
        }

        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioRegistroDto dto) {
        try {

            boolean emailExiste = usuarioRepository.findAll().stream()
                    .anyMatch(u -> u.getMail() != null && u.getMail().equalsIgnoreCase(dto.mail()));

            if (emailExiste) {
                return ResponseEntity.badRequest().body("El email ya se encuentra registrado.");
            }


            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(dto.nombre());
            nuevoUsuario.setApellido(dto.apellido());
            nuevoUsuario.setMail(dto.mail());
            nuevoUsuario.setCelular(dto.celular());
            nuevoUsuario.setRol(com.foodstore.Enums.Rol.Usuario);

            nuevoUsuario.setContrasenia(passwordEncoder.encode(dto.contrasenia()));

            Usuario guardado = usuarioRepository.save(nuevoUsuario);

            return ResponseEntity.ok(usuarioService.convertirADto(guardado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}