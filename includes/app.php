<?php 

use Model\ActiveRecord;
require __DIR__ . '/../vendor/autoload.php';

require 'funciones.php';
require 'database.php';
$dotenv = Dotenv\Dotenv::createInmutable(__DIR__);
$dotenv->safeLoad();

// Conectarnos a la base de datos
ActiveRecord::setDB($db);