document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', function(e) {
        const fechaSeleccionada = e.target.value;
        // el condigo de abajo escribira la fechaSeleccionada en ela url y posteriiormente podremos obtenrla con GET
        window.location = `?fecha=${fechaSeleccionada}`;
    });
}