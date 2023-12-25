document.querySelector('.button').addEventListener('click', () => {
  window.location.href = '/';
});

let images = Array.from(document.querySelectorAll('.img-post'));
let index = 0;

if (images.length >= 2) {
  document.getElementById('next').classList.add('visible');
  document.getElementById('prev').classList.add('visible');
}

document.getElementById('next').addEventListener('click', function () {
  images[index].classList.remove('active');
  index = (index + 1) % images.length;
  images[index].classList.add('active');
});

document.getElementById('prev').addEventListener('click', function () {
  images[index].classList.remove('active');
  index = (index - 1 + images.length) % images.length;
  images[index].classList.add('active');
});

let imgs = document.querySelectorAll('.img-post');

if (imgs.length == 0) {
  document.querySelector('main').style.display = 'none';
} else if (imgs.length <= 1) {
  document.getElementById('next').style.display = 'none';
  document.getElementById('prev').style.display = 'none';
}

images[0].classList.add('active');

document.querySelectorAll('.img-post').forEach(img => {
  img.addEventListener('click', () => {
    const src = img.getAttribute('src');
    window.open(`http://localhost:3000${src}`);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const postId = document.querySelector('[data-post-id]').getAttribute('data-post-id');
  const reactionType = '❤️';
  const reactionButtons = document.querySelectorAll('.button-reac');

  reactionButtons.forEach(button => {
    button.addEventListener('click', async () => {
      try {
        const response = await fetch(`/reaccionar/${encodeURIComponent(postId)}/${encodeURIComponent(reactionType)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al reaccionar: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Reacción exitosa. Nuevo conteo de reacciones:', data);

        // Actualiza el texto del botón con el nuevo conteo de reacciones
        updateReactionButtonText(button, data);
      } catch (error) {
        console.error('Error al reaccionar:', error);
      }
    });
  });

  function updateReactionButtonText(button, data) {
    const reactionType = button.textContent.trim().split(' ')[0];
    const reactionCount = data[`${reactionType.toLowerCase()}`]; // Obtiene el conteo específico para la reacción

    if (typeof reactionCount !== 'undefined') {
      button.textContent = `${reactionType} ${reactionCount}`;
    } else {
      console.error(`No se pudo obtener el conteo para la reacción ${reactionType}`);
    }
  }
});
