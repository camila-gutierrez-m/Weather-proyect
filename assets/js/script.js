const ciudades = [
  {
    cuidad: 1,
    nombre: "San Antonio",
    temp: "10°/27°",
    link: "detalles_1.html",
    img: "assets/image/sol.png",
    dia: "hoy",
    pronosticoSemanal: [
      { dia: "Lunes", min: 18, max: 24, estado: "Soleado" },
      { dia: "Martes", min: 17, max: 23, estado: "Soleado" },
      { dia: "Miercoles", min: 18, max: 24, estado: "Soleado" },
      { dia: "Jueves", min: 17, max: 23, estado: "Nublado" },
      { dia: "Viernes", min: 18, max: 24, estado: "Soleado" },
      { dia: "Sabado", min: 17, max: 23, estado: "Nublado" },
      { dia: "Domingo", min: 18, max: 24, estado: "Soleado" },
      ]
  },

  {
    ciudad: 2,
    nombre: "Santiago",
    temp: "13°/24°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 3,
    nombre: "Rancagua",
    temp: "12°/24°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 4,
    nombre: "Valparaíso",
    temp: "12°/17°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 5,
    nombre: "Viña del mar",
    temp: "11°/20°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 6,
    nombre: "Concepción",
    temp: "9°/19°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad:7,
    nombre: "Serena",
    temp: "12°/18°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    id: 8,
    nombre: "Valdivia",
    temp: "7°/18°",
    img: "assets/image/parcialmente nublado.jpg",
    dia: "Hoy",
  },

  {
    ciudad: 9,
    nombre: "Los Andes",
    temp: "13°/24°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  { 
    ciudad: 10,
    nombre: "Melipilla",
    temp: "12°/18°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 11,
    nombre: "Isla de Pascua",
    temp: "9°/18°",
    img: "assets/image/parcialmente nublado.jpg",
    dia: "Hoy",
  },

  {
    ciudad: 12,
    nombre: "Villarica",
    temp: "12°/18°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },
];
const principal = document.getElementById("principal");
const detalles = document.getElementById("detalles");

if(principal) {


  ciudades.forEach(ciudad => {

      let clase = "";

      if (!ciudad.pronosticoSemanal) {
          clase = "disabled";
      }

      principal.innerHTML += 
      `<div class="row">
      <div class="card card">
      <img src="${ciudad.img}" class="card-img-top icono" alt="...">
      <div class="card-body card__body">
        <h5 class="card-title  card__title">${ciudad.nombre} </h5>
      <p class="card-text">${ciudad.temp}</p>
       <p class="card-text"><small class="text-muted">${ciudad.dia} </small></p>
       <a class="btn btn-primary boton ${clase}" href="detalles_1.html?id=${ciudad.id}"  role="button">Detalle</a>
      </div>`;


  });
}
