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

const descrip = document.querySelector('#confession-text')

if(!descrip.innerHTML == ''){
    const btnSubmit = document.getElementById('btn-submit');

    btnSubmit.addEventListener('click', e =>{
        btnSubmit.style.display = 'none'
    })
}