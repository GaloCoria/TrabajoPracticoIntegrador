package com.foodstore.util;

import com.foodstore.Model.Categoria;
import com.foodstore.Model.Producto;
import com.foodstore.Model.Usuario;
import com.foodstore.repository.CategoriaRepository;
import com.foodstore.repository.ProductoRepository;
import com.foodstore.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.foodstore.Model.Usuario;
import com.foodstore.Enums.Rol;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {

        if (categoriaRepository.count() == 0) {
            System.out.println("Cargando datos iniciales de prueba...");

            Categoria catHamburguesas = new Categoria();
            catHamburguesas.setNombre("Hamburguesas");
            catHamburguesas.setDescripcion("Las mejores hamburguesas caseras");
            categoriaRepository.save(catHamburguesas);

            Categoria catPizzas = new Categoria();
            catPizzas.setNombre("Pizzas");
            catPizzas.setDescripcion("Pizzas a la piedra");
            categoriaRepository.save(catPizzas);

            Categoria catBebidas = new Categoria();
            catBebidas.setNombre("Bebidas");
            catBebidas.setDescripcion("Gaseosas y aguas");
            categoriaRepository.save(catBebidas);

            Producto p1 = new Producto();
            p1.setNombre("Hamburguesa Clásica");
            p1.setPrecio(3800.0);
            p1.setDescripcion("Medallón de carne, lechuga, tomate, cebolla y mayo");
            p1.setStock(50);
            p1.setDisponible(true);
            p1.setImagen("https://placehold.co/400x300?text=Hamburguesa");
            p1.setCategoria(catHamburguesas);
            productoRepository.save(p1);

            Producto p2 = new Producto();
            p2.setNombre("Pizza Muzzarella");
            p2.setPrecio(4500.0);
            p2.setDescripcion("Pizza clásica con salsa de tomate y muzzarella derretida");
            p2.setStock(30);
            p2.setDisponible(true);
            p2.setImagen("https://placehold.co/400x300?text=Pizza");
            p2.setCategoria(catPizzas);
            productoRepository.save(p2);

            Producto p3 = new Producto();
            p3.setNombre("Coca Cola 1L");
            p3.setPrecio(2000.0);
            p3.setDescripcion("Gaseosa linea Coca-Cola");
            p3.setStock(100);
            p3.setDisponible(true);
            p3.setImagen("https://placehold.co/400x300?text=Coca+Cola");
            p3.setCategoria(catBebidas);
            productoRepository.save(p3);

            System.out.println("¡Datos cargados exitosamente!");
        }


        if (usuarioRepository.count() == 0) {
            Usuario clientePrueba = new Usuario();
            usuarioRepository.save(clientePrueba);
            System.out.println("¡Usuario de prueba creado exitosamente!");
        }

        boolean adminExiste = usuarioRepository.findAll().stream()
                .anyMatch(u -> "admin@admin.com".equals(u.getMail()));

        if (!adminExiste) {
            Usuario admin = new Usuario();
            admin.setNombre("Super");
            admin.setApellido("Admin");
            admin.setMail("admin@admin.com");
            admin.setContrasenia("123456");
            admin.setRol(Rol.Admin);

            usuarioRepository.save(admin);
            System.out.println("¡Usuario Administrador creado con éxito!");
        }
    }
}