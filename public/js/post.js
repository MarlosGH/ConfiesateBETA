// Botón para volver al inicio
const backButton = document.querySelector('.button');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = '/';
  });
}

// Selección de todos los elementos del carrusel (imágenes y videos)
const mediaElements = Array.from(document.querySelectorAll('.img-post, .carousel video'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let index = 0;

// Si no hay ningún medio, ocultamos el main
if (mediaElements.length === 0) {
  const main = document.querySelector('main');
  if (main) main.style.display = 'none';
} else {
  // Mostrar el primer elemento
  mediaElements[0].classList.add('active');

  // Mostrar botones solo si hay más de un elemento
  if (mediaElements.length > 1) {
    prevBtn.classList.add('visible');
    nextBtn.classList.add('visible');
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  // Función para actualizar el elemento activo
  function showMedia(newIndex) {
    mediaElements[index].classList.remove('active', 'fade-in');
    index = (newIndex + mediaElements.length) % mediaElements.length;
    mediaElements[index].classList.add('active', 'fade-in');
  }

  // Botones de navegación
  nextBtn.addEventListener('click', () => {
    // Si el actual es video, lo pausamos antes de pasar al siguiente
    if (mediaElements[index].tagName === 'VIDEO') {
      mediaElements[index].pause();
    }
    showMedia(index + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (mediaElements[index].tagName === 'VIDEO') {
      mediaElements[index].pause();
    }
    showMedia(index - 1);
  });

  // Soporte con teclado (← y →)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      if (mediaElements[index].tagName === 'VIDEO') mediaElements[index].pause();
      showMedia(index + 1);
    }
    if (e.key === 'ArrowLeft') {
      if (mediaElements[index].tagName === 'VIDEO') mediaElements[index].pause();
      showMedia(index - 1);
    }
  });
}

// ------- PANTALLA COMPLETA SOLO PARA IMÁGENES -------
const fullscreenableImages = document.querySelectorAll('.fullscreenable');
const modal = document.getElementById('fullscreenModal');
const modalImg = document.getElementById('fullscreenImage');
const closeModal = document.querySelector('.close-modal');

fullscreenableImages.forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImg.src = img.src;
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});
