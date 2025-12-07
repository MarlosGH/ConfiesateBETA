window.addEventListener('resize', shadowIcons);

function shadowIcons() {
    const icon = document.querySelectorAll('.fa-solid');
    icon.forEach(i => {
        i.style.display = window.innerWidth < 304 ? 'none' : 'block';
    });
}

document.querySelector(".button").addEventListener("click", () => {
    window.location.href = "/confesarme";
});

/// ----

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



let currentPage = 1;
const postsContainer = document.getElementById('posts-container');
const loadMoreButton = document.getElementById('load-more-button');

loadMoreButton.addEventListener('click', async () => {
  currentPage++;

  try {
    const response = await fetch(`/load-more?page=${currentPage}`);
    const data = await response.json();
    const nuevasConfesiones = data.confesiones;

    if (!nuevasConfesiones || nuevasConfesiones.length === 0) {
      loadMoreButton.textContent = 'No hay más confesiones';
      loadMoreButton.disabled = true;
      return;
    }

    nuevasConfesiones.forEach(confesion => {
      const folderPath = `/uploads/${confesion.carpeta}`;
      const mediaFiles = JSON.parse(confesion.imagenes);
      const firstMediaFile = mediaFiles[0];

      const postElement = document.createElement('div');
      postElement.classList.add('post');

      postElement.innerHTML = `
        <div class="titles">
          <h2 class="title-post"><a href="/post/${confesion.id}" class="a">${confesion.titulo}</a></h2>
          <p class="descripcion-post">${confesion.descripcion}</p>
        </div>
        <div class="image-container">
          ${firstMediaFile && firstMediaFile.match(/\.(mp4|webm|ogg|mkv)$/i)
            ? `<a href="/post/${confesion.id}"><video controls><source src="${folderPath}/${firstMediaFile}" type="video/mp4"></video></a>`
            : `<a href="/post/${confesion.id}" class="img-a"><img src="${folderPath}/${firstMediaFile}" class="img-post" alt=""></a>`
          }
        </div>
        <div class="opciones">
          <a href="/post/${confesion.id}" style="text-decoration: none; color: #5f5f5f !important;">
            <div class="option_conten comment-conten"><span class="span-comment">Comentarios</span></div>
          </a>
          <div class="option_conten heart-conten"><span class="span-heart">Me gusta</span></div>
        </div>
      `;

      postsContainer.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error al cargar más confesiones:', error);
  }
});
