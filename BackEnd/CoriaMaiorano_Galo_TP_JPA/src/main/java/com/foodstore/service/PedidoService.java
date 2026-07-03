package com.foodstore.service;

import com.foodstore.Enums.Estado;
import com.foodstore.Model.Pedido;
import com.foodstore.Model.Producto;
import com.foodstore.Model.Usuario;
import com.foodstore.dto.DetallePedidoDto;
import com.foodstore.dto.PedidoDto;
import com.foodstore.dto.PedidoRespuestaDto;
import com.foodstore.dto.DetalleRespuestaDto;
import com.foodstore.repository.PedidoRepository;
import com.foodstore.repository.ProductoRepository;
import com.foodstore.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Pedido crearPedido(PedidoDto dto) {
        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDate.now());
        pedido.setEstado(Estado.EN_PREPARACION);
        pedido.setFormaPago(dto.formaPago());

        Usuario cliente = usuarioRepository.findById(dto.usuarioId())
                .orElseGet(() -> usuarioRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("No hay ningún usuario en la BD para asignar el pedido")));
        pedido.setUsuario(cliente);

        for (DetallePedidoDto detalleDto : dto.detalles()) {
            Producto producto = productoRepository.findById(detalleDto.productoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < detalleDto.cantidad()) {
                throw new RuntimeException("Sin stock suficiente para: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - detalleDto.cantidad());
            productoRepository.save(producto);

            pedido.addDetallePedido(detalleDto.cantidad(), producto);
        }

        pedido.calcularTotal();

        return pedidoRepository.save(pedido);
    }

    public List<PedidoRespuestaDto> buscarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findAllByUsuarioId(usuarioId).stream().map(pedido -> {
            String nombreCompleto = pedido.getUsuario() != null ?
                    pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido() : "Consumidor Final";

            String mailCliente = pedido.getUsuario() != null ?
                    pedido.getUsuario().getMail() : "Sin mail";
            List<DetalleRespuestaDto> detalles = pedido.getDetalles().stream().map(d ->
                    new DetalleRespuestaDto(
                            d.getCantidad(),
                            d.getSubtotal(),
                            d.getProducto() != null ? d.getProducto().getNombre() : "Producto eliminado"
                    )
            ).collect(Collectors.toList());

            return new PedidoRespuestaDto(
                    pedido.getId(),
                    pedido.getFecha(),
                    pedido.getEstado(),
                    pedido.getTotal(),
                    pedido.getFormaPago(),
                    detalles,
                    nombreCompleto,
                    mailCliente
            );
        }).collect(Collectors.toList());
    }

    public List<PedidoRespuestaDto> buscarTodosLosPedidos() {
        return pedidoRepository.findAll().stream().map(pedido -> {
            String nombreCompleto = pedido.getUsuario() != null ?
                    pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido() : "Consumidor Final";

            String mailCliente = pedido.getUsuario() != null ?
                    pedido.getUsuario().getMail() : "Sin mail";
            List<DetalleRespuestaDto> detalles = pedido.getDetalles().stream().map(d ->
                    new DetalleRespuestaDto(
                            d.getCantidad(),
                            d.getSubtotal(),
                            d.getProducto() != null ? d.getProducto().getNombre() : "Producto eliminado"
                    )
            ).collect(Collectors.toList());

            return new PedidoRespuestaDto(
                    pedido.getId(),
                    pedido.getFecha(),
                    pedido.getEstado(),
                    pedido.getTotal(),
                    pedido.getFormaPago(),
                    detalles,
                    nombreCompleto,
                    mailCliente
            );
        }).collect(Collectors.toList());
    }


    @Transactional
    public void actualizarEstado(Long id, Estado nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);
    }


}