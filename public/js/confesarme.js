document.querySelector(".button").addEventListener("click", (e) => {
  window.location.href = "/";
});

// FUNCIÓN DE RENDERIZAR IMÁGENES Y VIDEOS
function previewImages() {
  const input = document.getElementById("image-input");
  const previewContainer = document.getElementById("img-conten");
  previewContainer.innerHTML = "";

  if (input.files && input.files.length > 0) {
    let currentIndex = 0;
    const files = Array.from(input.files);

    // Pre-cargar todas las URLs de los archivos
    const mediaElements = files.map((file) => {
      const url = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("carousel-image");
        return img;
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.classList.add("carousel-video");
        return video;
      } else {
        const msg = document.createElement("p");
        msg.textContent = "Archivo no compatible: " + file.name;
        return msg;
      }
    });

    // Contenedor principal
    const mediaWrapper = document.createElement("div");
    mediaWrapper.classList.add("carousel-media");
    previewContainer.appendChild(mediaWrapper);

    // Mostrar primer archivo
    mediaWrapper.appendChild(mediaElements[currentIndex]);

    // Botones del carrusel
    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    prevBtn.type = "button";
    nextBtn.type = "button";
    prevBtn.innerHTML = "◀";
    nextBtn.innerHTML = "▶";
    prevBtn.classList.add("carousel-btn", "prev");
    nextBtn.classList.add("carousel-btn", "next");
    previewContainer.appendChild(prevBtn);
    previewContainer.appendChild(nextBtn);

    // Función para mostrar el siguiente/anterior
    function showFile(index) {
      // detener video si estaba reproduciéndose
      const currentMedia = mediaElements[currentIndex];
      if (currentMedia.tagName === "VIDEO") {
        currentMedia.pause();
        currentMedia.currentTime = 0;
      }

      mediaWrapper.innerHTML = "";
      mediaWrapper.appendChild(mediaElements[index]);
    }

    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + files.length) % files.length;
      showFile(currentIndex);
    };

    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % files.length;
      showFile(currentIndex);
    };
  }
}


previewImages();
