<template>
  <div class="container">
    <div v-if="!logueado">
        <input
        type="text"
        placeholder="Introduce un Nick"
        class="form-control"
        v-model="autor"
        @keyup.enter="loguear"
      >
    </div>
    <div v-if="logueado">
      <br>

      <div id="tit" class="h1">Proyecto Vue.js- Alejandro Cerdá Muñoz</div>
      <!--
    <div class="form-group" v-if="!estado">
      <input
        type="text"
        placeholder="Introduce un Nick"
        class="form-control"
        v-model="nick"
        @keyup.enter="anadeNick"
      >
    </div>
    <div class="col-12">
      <file-pond
        name="test"
        ref="pond"
        label-idle="Arrastra aquí el archivo..."
        allow-multiple="false"
        accepted-file-types="image/jpeg, image/png,image/jpg"
        allowImagePreview="false"
        server="http://localhost:3000/files"
        v-bind:files="myFiles"
        v-on:init="handleFilePondInit"
      />
    </div>
      -->
      <div class="form-group">
        <input
          type="text"
          placeholder="¿Qué necesitas recordar?"
          class="form-control"
          v-model="nombre"
          @keyup.enter="anadir"
        >
      </div>
      <div class="form-group">
        <input type="text" placeholder="Filtra notas:" class="form-control" v-model="busqueda">
      </div>
      <hr>
      <small class="textopeque">
        <img class="mr-1" src="@/assets/barras.png">
        {{tareasPendientes}} Tareas pendientes de un total de {{this.tareas.length}}
      </small> ||
      <small id="comple" @click="borraCompletadas">X Borrar tareas completadas</small>

      <hr>

      <ul class="list-group">
        <transition-group name="task-list" tag="div">
          <li
            class="list-group-item task-list-item"
            v-for="(tarea,index) in tareasPorPrioridad"
            :key="tarea.fecha.toString()"
          >
            <div class="row">
              <input
                class="checkbox-circle"
                type="checkbox"
                v-on:click="completar(index)"
                v-bind:checked="tarea.completada"
              >
              <h1
                v-bind:class="[{completado : tarea.completada},'col-11','d-flex justify-content-start']"
              >{{tarea.nombre}}</h1>
              <button id="borra" class="btn btn-danger" @click="borrar(index)">
                <img class src="@/assets/cerrar.png">
              </button>
            </div>
            <div class="row">
              <div class="col-auto justify-self-start">
                <small>Prioridad:</small>
                <button
                  type="button"
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==1 ? ['b1','btn btn-info'] : 'desactivado',]"
                  @click="prioridad(index,'1')"
                >
                  <img class="mr-1" src="@/assets/baja.png">Low
                </button>
                <button
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==2 ? ['b1','btn btn-primary'] : 'desactivado']"
                  @click="prioridad(index,'2')"
                >Normal</button>
                <button
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==3 ? ['b1','btn btn-danger'] : 'desactivado']"
                  @click="prioridad(index,'3')"
                >
                  <img class="mr-1" src="@/assets/alta.png">High
                </button>
                <small>
                  <img src="@/assets/hora.png">
                  Añadido hace {{tarea.fecha | moment("from", "now", true)}} ago
                </small>
                <small>
                  Creado por: {{tarea.autor}}
                </small>
              </div>
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  sockets: {
    connection: function(arrayNotas) {
      this.tareas = arrayNotas;
    },
    nuevaNota: function(nota) {
      this.tareas.push(nota);
    },
    borrarNota: function(index) {
      this.tareas.splice(JSON.parse(index), 1);
    },
    cambioRealizado: function(nuevoArray) {
      this.tareas = nuevoArray;
    }
  },
  data() {
    return {
      tareas: [],
      nombre: "",
      busqueda: "",

      incio: false,
      autor: "",
      logueado: false
    };
  },
  methods: {
    anadir: function() {
      let nota = {
        nombre: this.nombre,
        completada: false,
        prioridad: "1",
        fecha: new Date(),
        autor: this.autor
      };
      this.tareas.push(nota);
      for (var i = 0; i < this.tareas.length; i++) {
        if (this.tareas[i].tiene == false) {
          this.tareas[i].fecha++;
          this.tareas[i].tiene = true;
        }
      }
      this.nombre = "";
      this.$socket.emit("nuevaNota", nota);
    },
    borrar: function(index) {
      this.tareas.splice(index, 1);
      this.$socket.emit("cambioRealizado", this.tareas);
    },
    borraCompletadas: function() {
      this.tareas = this.tareas.filter(tarea => !tarea.completada);
      this.$socket.emit("cambioRealizado", this.tareas);
    },
    prioridad: function(index, n) {
      this.tareas[index].prioridad = n;
      this.$socket.emit("cambioRealizado", this.tareas);
    },
    completar: function(index) {
      this.tareas[index].completada = !this.tareas[index].completada;
      this.$socket.emit("cambioRealizado", this.tareas);
    },
    loguear: function(){
      this.logueado = true;
    }
  },

  computed: {
    tareasPendientes: function() {
      return this.tareas.filter(tarea => !tarea.completada).length;
    },
    tareasPorPrioridad: function() {
      return this.tareas
        .sort((a, b) => b.prioridad - a.prioridad)
        .filter(tarea =>
          tarea.nombre.toLowerCase().startsWith(this.busqueda.toLowerCase())
        );
    }
  },

  mounted: function() {}
};
</script>

<style scoped>
li {
  cursor: pointer;
}
.completado {
  text-decoration: line-through;
  color: rgb(17, 185, 129);
}
.desactivado {
  background: #646363;
  margin-right: 10px;
}

small {
  color: grey;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
}
li {
  color: white;
  background: #3a3939;
  border: solid 1px white;
}

.b1 {
  margin-right: 10px;
}

.b2 {
  margin-right: 10px;
}
.b3 {
  margin-right: 10px;
}
.textopeque {
  color: white;
}
#comple {
  cursor: pointer;
  color: rgb(255, 145, 0);
}
#tit {
  color: white;
}
.task-list-item {
  transition: all 1s;
}

.task-list-enter,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(500px);
}

.task-list-move {
  transition: transform 1s;
}
#borra {
  height: 40px;
}
</style>

