<?php

namespace Controllers;

use Model\Cita;
use Model\Servicio;
use Model\CitaServicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        //debuguear ($servicios);
        echo json_encode($servicios);
    }

    public static function guardar() {
        //debuguear($_POST);
        // Almacena y devulve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        
        $id = $resultado['id'];
        //console.log($_POST);

        // Almacena los servicios con el ID de la cita
        $idServicios = explode(",",$_POST['servicios']); // Nos permite converitr un string en un arreglo
        //debuguear($id);
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            //debuguear($args);
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }
        
        
        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            //Con el codigo de abajo recargamos la misma pagina donde nos encontrabamos
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}