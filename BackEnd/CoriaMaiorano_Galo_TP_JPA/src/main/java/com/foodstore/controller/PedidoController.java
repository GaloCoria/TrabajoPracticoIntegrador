package com.foodstore.controller;

import com.foodstore.Model.Pedido;
import com.foodstore.dto.PedidoDto;
import com.foodstore.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.foodstore.Enums.Estado;
@RestController
@RequestMapping("/api/pedido")

public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<?> confirmarCompra(@RequestBody PedidoDto pedidoDto) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoDto);
            return ResponseEntity.ok(nuevoPedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerMisPedidos(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.buscarPedidosPorUsuario(usuarioId));
    }

    @GetMapping("/todos")
    public ResponseEntity<?> obtenerTodosLosPedidos() {
        try {
            return ResponseEntity.ok(pedidoService.buscarTodosLosPedidos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Estado nuevoEstado = Estado.valueOf(body.get("estado"));
            pedidoService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok("Estado actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar estado: " + e.getMessage());
        }
    }
}