document.querySelector(".button").addEventListener("click", (e) =>{
    window.location.href = "/"
})

// // FUNCION DE RENDERIZAR IMAGEN

function previewImages() {
    let input = document.getElementById('image-input');
    let previewContainer = document.getElementById('img-conten');

    previewContainer.innerHTML = '';

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            let reader = new FileReader();
            let imagePreview = document.createElement('img');

            reader.onload = (function (image) {
                return function (e) {
                    image.src = e.target.result;
                };
            })(imagePreview);

            reader.readAsDataURL(input.files[i]);
            imagePreview.classList.add("image-preview")
            previewContainer.appendChild(imagePreview);
        }
    }
}


// Añadir informacion si el post tiene mas de una imagen
function addInfo(post) {
    const p = document.createElement('p');
    p.innerHTML = "Dale click para ver mas imagenes";

    const moreContainers = post.querySelectorAll('.more');

    moreContainers.forEach(container => {
        container.appendChild(p.cloneNode(true));
        const firstImage = container.previousElementSibling.querySelector('img');
        firstImage.style.display = 'block';
    });
}

const posts = document.querySelectorAll('.post');

posts.forEach(post => {
    const imageContainer = post.querySelector('.image-container');
    const images = imageContainer.querySelectorAll('img');

    if (images.length > 1) {
        addInfo(post);
    }
});


previewImages();

const descrip = document.querySelector('#confession-text')

if(!descrip.innerHTML == ''){
    const btnSubmit = document.getElementById('btn-submit');

    btnSubmit.addEventListener('click', e =>{
        btnSubmit.style.display = 'none'
    })
}