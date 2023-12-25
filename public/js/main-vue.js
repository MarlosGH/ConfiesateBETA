// public/js/main-vue.js

new Vue({
    el: '#app',
    data: {
      posts: [], // Aquí almacenaremos las confesiones
      page: 1,   // Página actual
      loading: false // Para evitar múltiples cargas
    },
    methods: {
        loadMorePosts: function () {
            console.log('Cargando más confesiones...');
            if (!this.loading) {
              this.loading = true;
              fetch(`/load-more?page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                  console.log('Datos cargados:', data);
                  if (data.confesiones && Array.isArray(data.confesiones)) {
                    // Clona el array existente y luego agrega las nuevas confesiones
                    this.posts = this.posts.concat(data.confesiones);
                    this.page++;
                  } else {
                    console.error('La respuesta del servidor no contiene un array de confesiones válido:', data);
                  }
                  this.loading = false;
                })
                .catch(error => {
                  console.error('Error al cargar más confesiones:', error);
                  this.loading = false;
                });
            }
          }
               
    },
    mounted: function () {
      // Lógica que se ejecuta después de que Vue se ha montado en el DOM
      // Puedes usar esta sección para inicializar datos, por ejemplo, cargar las primeras confesiones
      this.loadMorePosts();
    }
  });
  