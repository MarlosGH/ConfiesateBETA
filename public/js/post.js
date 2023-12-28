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
  hideAllMedia();
  index = (index + 1) % images.length;
  showCurrentMedia();
});

document.getElementById('prev').addEventListener('click', function () {
  hideAllMedia();
  index = (index - 1 + images.length) % images.length;
  showCurrentMedia();
});


function hideAllMedia() {
  images.forEach(img => {
    img.classList.remove('active');
  });
}

function showCurrentMedia() {
  images[index].classList.add('active');
}

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

    window.open(`https://confiesatebeta-production.up.railway.app${src}`);
  });
});