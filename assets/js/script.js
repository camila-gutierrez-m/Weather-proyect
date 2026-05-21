const ciudades = [
  {
    ciudad: 1,
    nombre: "San Antonio",
    temp: "10°/27°",
    link: "detalles.html",
    img: "assets/image/sol.png",
    dia: "hoy",
    foto: "assets/image/Puerto de San Antonio.jpg",
    termometro: "/assets/image/thermometer-sun.svg",
    viento: "assets/image/wind.svg",
    wind: "15-30 km/h",
    pronosticoSemanal: [
      { dia: "Lunes", min: 18, max: 24, estado: "Soleado" },
      { dia: "Martes", min: 17, max: 23, estado: "Soleado" },
      { dia: "Miercoles", min: 18, max: 24, estado: "Soleado" },
      { dia: "Jueves", min: 11, max: 19, estado: "Nublado" },
      { dia: "Viernes", min: 18, max: 24, estado: "Soleado" },
      { dia: "Sabado", min: 10, max: 17, estado: "Nublado" },
      { dia: "Domingo", min: 18, max: 24, estado: "Soleado" },
    ],
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
    ciudad: 7,
    nombre: "Serena",
    temp: "12°/18°",
    img: "assets/image/sol.png",
    dia: "Hoy",
  },

  {
    ciudad: 8,
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

if (principal) {
  ciudades.forEach((ciudad) => {
    let clase = "";

    if (!ciudad.pronosticoSemanal) {
      clase = "disabled";
    }

    principal.innerHTML += 
    `<div class="col g-4">
      <div class="card h-100 card">
      <img src="${ciudad.img}" class="card-img-top icono" alt="...">
      <div class="card-body card__body">
        <h5 class="card-title  card__title">${ciudad.nombre} </h5>
      <p class="card-text">${ciudad.temp}</p>
       <p class="card-text"><small class="text-muted">${ciudad.dia} </small></p>
       <a class="btn btn-primary boton ${clase}" href="detalles.html?ciudad=${ciudad.ciudad}"  role="button">Detalle</a>
      </div>`;
  });
}

if (detalles) {
  const params = new URLSearchParams(window.location.search);

  const idUrl = Number(params.get("ciudad"));
  ciudades.forEach((ciudad) => {
    if (ciudad.ciudad === idUrl) {
      detalles.innerHTML += ` 
    <div class="card-header  header">
    <img src="${ciudad.foto}" alt="...">
    <div class="card-body">
      <h5 class="card-title">${ciudad.nombre}</h5>
      <p>${ciudad.dia}</p>
      <img src="${ciudad.termometro}" class="card-img card__ic" alt="#"/>
      <p class="card-text">${ciudad.temp}</p>
     <img src="${ciudad.viento}" class="card-img card__ic">
      <p class="card-text">${ciudad.wind}</p>
    </div>
  </div>

<div class="card" style="width: 18rem;">
    <div class="card-body">
        <h3> Pronostico Semanal </h3>
        ${ciudad.pronosticoSemanal.map(dia => `
        <div class="card mb-2">
          <div class="card-body">
            <h6 class="card-title">${dia.dia}</h6>
            <p class="card-text">Min ${dia.min}° / Max ${dia.max}°</p>
            <p class="card-text">${dia.estado}</p>
          </div>
        </div>
      `).join("")}
    </div>
  </div>
`;
const conteo = {};
 ciudad.pronosticoSemanal.forEach((dia) => {
    if (conteo[dia.estado]) {
      conteo [dia.estado] += 1;
        } else {
          conteo[dia.estado] = 1;
        }
      });
        let estadoGanador = "";
        let cantidadGanadora = 0;
        for (let estado in conteo){
          if (conteo[estado] > cantidadGanadora) {
            cantidadGanadora = conteo[estado];
            estadoGanador = estado;
          }
          }
  
  document.getElementById("conteo").innerHTML = `Mayormente ${estadoGanador}, ${cantidadGanadora} días`;
    }
  });
    }
  


