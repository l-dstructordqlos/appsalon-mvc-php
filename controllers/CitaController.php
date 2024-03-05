<?php
namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index( Router $router ) {

        session_start();

        // funcion que redirige en caso el usuario no este autentificado
        isAuth();
        
        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}