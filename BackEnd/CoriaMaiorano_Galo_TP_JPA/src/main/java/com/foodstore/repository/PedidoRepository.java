package com.foodstore.repository;

import com.foodstore.Model.Pedido;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends BaseRepository<Pedido, Long> {

    @Query("SELECT DISTINCT p FROM Pedido p JOIN FETCH p.detalles d JOIN FETCH d.producto WHERE p.usuario.id = :usuarioId")
    List<Pedido> findAllByUsuarioId(Long usuarioId);
}