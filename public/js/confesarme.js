
const descrip = document.querySelector('#confession-text')
const btnSubmit = document.getElementById('btn-submit');

if(!descrip.innerHTML == ''){

    btnSubmit.addEventListener('click', e =>{
        btnSubmit.style.display = 'none'
    })
}


document.querySelector(".button").addEventListener("click", (e) => {
    const confirmation = confirm("¿Estás seguro de que quieres volver a la página de inicio? Tu confesión no se guardará.");

    if (confirmation) {
        window.location.href = "/";
    }
});

const form = document.querySelector('.confession-form');

btnSubmit.addEventListener('click', e => {
    // Pregunta al usuario si realmente quiere publicar la confesión
    const confirmation = confirm("¿Estás seguro de que quieres publicar esta confesión?");

    // Si el usuario confirma, envía el formulario
    if (!confirmation) {
        e.preventDefault(); // Cancela el envío del formulario si no hay confirmación
    }
});





document.querySelector(".button").addEventListener("click", (e) =>{
    window.location.href = "/"
})

// FUNCION DE RENDERIZAR ARCHIVOS (IMÁGENES O VIDEOS)
function previewFiles() {
    let input = document.getElementById('file-input');
    let previewContainer = document.getElementById('file-conten');

    previewContainer.innerHTML = '';

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            let file = input.files[i];
            let filePreview = document.createElement('div');

            // Verifica si el archivo es una imagen
            if (file.type.startsWith('image')) {
                let reader = new FileReader();
                let imagePreview = document.createElement('img');

                reader.onload = (function (image) {
                    return function (e) {
                        image.src = e.target.result;
                    };
                })(imagePreview);

                reader.readAsDataURL(file);
                imagePreview.classList.add("file-preview");
                filePreview.appendChild(imagePreview);
            }
            // Verifica si el archivo es un video
            else if (file.type.startsWith('video')) {
                let videoPreview = document.createElement('video');
                videoPreview.src = URL.createObjectURL(file);
                videoPreview.classList.add("file-preview");
                videoPreview.setAttribute("controls", "controls");
                filePreview.appendChild(videoPreview);
            }

            previewContainer.appendChild(filePreview);
        }
    }
}

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', previewFiles);


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

