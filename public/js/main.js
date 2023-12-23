document.getElementById('button-orden').addEventListener('click', () => {
    document.querySelector('.opciones-orden').classList.toggle('ocultar');
});

document.querySelector(".button").addEventListener("click", () => {
    window.location.href = "/confesarme";
});


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

  let page = 2; // Comenzamos desde la segunda página (cargar más confesiones)
  let loading = false;

  const container = document.getElementById('main-content');

  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
      loading = true;
      fetch(`/load-more?page=${page}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const postTemplate = document.getElementById('post-template');
            
            data.forEach(confesion => {
              const postClone = document.importNode(postTemplate.content, true);
              
              // Rellena el clon con los datos del post actual
              const postElements = postClone.querySelectorAll('.title-post, .descripcion-post');
              postElements[0].innerHTML = `<a href="/post/${confesion.id}" style="text-decoration: none; color: #5f5f5f !important;">${confesion.titulo}</a>`;
              postElements[1].textContent = confesion.descripcion;

              // Puedes seguir llenando los otros elementos del post (imagen, comentarios, etc.)

              container.appendChild(postClone);
            });
            page++;
          }
        })
        .finally(() => {
          loading = false;
        });
    }
  });
});
