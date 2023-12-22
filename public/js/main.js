document.getElementById('button-orden').addEventListener('click', () => {
    document.querySelector('.opciones-orden').classList.toggle('ocultar');
});

window.addEventListener('resize', shadowIcons);

function shadowIcons() {
    const icon = document.querySelectorAll('.fa-solid');
    icon.forEach(i => {
        i.style.display = window.innerWidth < 348 ? 'none' : 'block';
    });
}

document.querySelector(".button").addEventListener("click", () => {
    window.location.href = "/confesarme";
});

let totalConfesiones;


let textconfesiones = document.querySelector('.confesionesTotal')
textconfesiones.innerHTML = `${totalConfesiones}`;


document.addEventListener('DOMContentLoaded', () => {
    // Hacer una solicitud al servidor para obtener la cantidad total de confesiones
    fetch('/obtenerTotalConfesiones')
      .then(response => response.json())
      .then(data => {
        // Actualizar el contenido HTML con la cantidad total de confesiones
        const confesionesTotalElement = document.querySelector('.confesionesTotal');
        confesionesTotalElement.textContent = data.totalConfesiones;
      })
      .catch(error => {
        console.error('Error al obtener la cantidad total de confesiones:', error);
      });
  });