document.getElementById('button-orden').addEventListener('click', () => {
  document.querySelector('.opciones-orden').classList.toggle('ocultar');
});

document.querySelector(".button").addEventListener("click", () => {
  window.location.href = "/confesarme";
});

document.addEventListener('DOMContentLoaded', () => {
  const confesionesTotalElement = document.querySelector('.confesiones_total');

 
  function updateTotalConfesiones() {
    fetch('/obtenerTotalConfesiones')
      .then(response => response.json())
      .then(data => {
        confesionesTotalElement.textContent =  'CONFESIONES: ' + data.totalConfesiones;
        if (data.totalConfesiones <= 5) {
          document.querySelector('#load-more-button').style.display = 'none'
        }
      })
      .catch(error => {
        console.error('Error al obtener la cantidad total de confesiones:', error);
      });
  }
  updateTotalConfesiones();

  let page = 2; // Comenzamos desde la segunda página (cargar más confesiones)
  let loading = false;


// Función para crear elementos de publicación
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.className = 'post';

  const titlesConten = document.createElement('div');
  titlesConten.className = 'titles';

  const createLinkElement = (href, text, className) => {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', href);
    linkElement.className = className;
    linkElement.textContent = text;
    return linkElement;
  };
  const aHrefTitle = createLinkElement(`/post/${post.id}`, post.titulo, 'a');
  const aHrefImage = createLinkElement(`/post/${post.id}`, '', 'img-a');

  const titleElement = document.createElement('h2');
  titleElement.className = 'title-post'

  const divDescriptionContainer = document.createElement('div');
  divDescriptionContainer.style.maxHeight = '100px'

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = post.descripcion;

  const imagesContainer = document.createElement('div');
  imagesContainer.className = 'image-container';

  // Verifica si post.imagenes es una cadena y conviértela a un array
  const imagesArray = typeof post.imagenes === 'string' ? JSON.parse(post.imagenes) : post.imagenes;

  // Utiliza imagesArray en lugar de post.imagenes
  if (Array.isArray(imagesArray)) {
    imagesArray.forEach(image => {
      const imageElement = document.createElement('img');
      imageElement.className = 'img-post';
      imageElement.src = `uploads/${post.carpeta}/${image}`;
      // Añade un chequeo adicional antes de intentar añadir elementos hijo
      if (imagesContainer !== null) {
        imagesContainer.appendChild(imageElement);
        aHrefImage.appendChild(imageElement)
        imagesContainer.appendChild(aHrefImage);
      }
    });
  }
  const opcionesDiv = document.createElement('div');
  opcionesDiv.className = 'opciones';

  const aHrefOpciones = createLinkElement(`/post/${post.id}`, '', '');
  const optionCommentDiv = document.createElement('div');
  optionCommentDiv.className = 'option_conten comment-conten';
  aHrefOpciones.style.textDecoration = 'none'
  aHrefOpciones.style.color = '#5f5f5f'

  const spanComment = document.createElement('span')
  spanComment.textContent = 'Comentarios'
  spanComment.className = 'span-comment'
  

  const spanLike = document.createElement('span')
  spanLike.textContent = 'Me gusta'
  spanLike.className = 'span-heart'
  

  const divLike = document.createElement('div');
  divLike.className = 'option_conten heart-conten'

  postElement.appendChild(titlesConten)
  titleElement.appendChild(aHrefTitle)
  postElement.appendChild(titleElement);
  postElement.appendChild(descriptionElement);
  divDescriptionContainer.appendChild(descriptionElement);
  postElement.appendChild(divDescriptionContainer)
  titlesConten.appendChild(titleElement)
  titlesConten.appendChild(divDescriptionContainer);

  if (imagesContainer !== null) {
    postElement.appendChild(imagesContainer);
  }

  postElement.appendChild(opcionesDiv)
  optionCommentDiv.appendChild(spanComment)
  aHrefOpciones.appendChild(optionCommentDiv)
  opcionesDiv.appendChild(aHrefOpciones)
  opcionesDiv.appendChild(divLike);
  divLike.appendChild(spanLike)

  return postElement;
}

// Función para agregar publicaciones al DOM
function appendPostsToDOM(data) {
  const postsContainer = document.getElementById('posts-container');
  const confesiones = data.confesiones;

  // Verificar si confesiones es un array y si el contenedor existe
  if (Array.isArray(confesiones) && confesiones.length > 0 && postsContainer) {
    confesiones.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  } else if (!postsContainer) {
    console.error('El contenedor de publicaciones no se encontró en el DOM.');
  } else {
    console.error('La respuesta del servidor no contiene un array de confesiones válido:', data);
  }
}

// Función para cargar más publicaciones
function loadMorePosts() {
  console.log('Cargando más confesiones...');
  if (!loading) {
    loading = true;
    fetch(`/load-more?page=${page}`)  
      .then(response => response.json())
      .then(data => {
        console.log('Datos cargados:', data);
        if (data.confesiones < 1) {
          document.querySelector('#load-more-button').style.display = 'none'
        }
        if (data.confesiones && Array.isArray(data.confesiones)) {
          appendPostsToDOM(data); // Cambiado a esta función para manejar la lógica de agregar publicaciones
          page++;
        } else {
          
          console.error('La respuesta del servidor no contiene un array de confesiones válido:', data);
        }
        loading = false;
      })
      .catch(error => {
        console.error('Error al cargar más confesiones:', error);
        loading = false;
      });
  }
}

document.getElementById('load-more-button').addEventListener('click', loadMorePosts);
});
