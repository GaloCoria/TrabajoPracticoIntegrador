package com.foodstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodStoreApplication.class, args);
        System.out.println("🚀 ¡Servidor de Food Store iniciado correctamente en el puerto 8080!");
    }
}