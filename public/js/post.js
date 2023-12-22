document.querySelector('.button').addEventListener('click', ()=>{window.location.href = '/'})

let images = Array.from(document.querySelectorAll('.img-post'));
let index = 0;
let viewImages;


if (images.length >= 2) {
    document.getElementById('next').classList.add('visible');
    document.getElementById('prev').classList.add('visible');
}

document.getElementById('next').addEventListener('click', function() {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
});

document.getElementById('prev').addEventListener('click', function() {
    images[index].classList.remove('active');
    index = (index - 1 + images.length) % images.length;
    images[index].classList.add('active');
    
});
let imgs = document.querySelectorAll('.img-post');

if(imgs.length == 0){
    document.querySelector('main').style.display = 'none'
}else if(imgs.length <= 1){
    document.getElementById('next').style.display = 'none'
    document.getElementById('prev').style.display = 'none'
}

images[0].classList.add('active');

