class Ubicacion {
  #id;
  #nombre;
  #lat;
  #lon;
constructor(id, nombre, lat, lon) {
    this.#id     = id;
    this.#nombre = nombre;
    this.#lat    = lat;
    this.#lon    = lon;
  }
  get id()     { return this.#id; }
  get nombre() { return this.#nombre; }
  get lat()    { return this.#lat; }
  get lon()    { return this.#lon; }

  _buildApiUrl() {
    return (
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${this.#lat}&longitude=${this.#lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max` +
      `&current_weather=true` +
      `&timezone=America%2FSantiago` +
      `&forecast_days=7`
    );
  }
  toString() {
    return `${this.#nombre} (lat: ${this.#lat}, lon: ${this.#lon})`;
  }
}

class DiaClima {
  static #DIAS_ES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  constructor(fecha, min, max, viento, codigoWMO) {
    this.fecha  = fecha;
    this.dia    = DiaClima.#DIAS_ES[new Date(fecha + "T12:00:00").getDay()];
    this.min    = Math.round(min);
    this.max    = Math.round(max);
    this.viento = Math.round(viento);

    const { estado, icono } = DiaClima.#interpretarWMO(codigoWMO);
    this.estado = estado;
    this.icono  = icono;
  }

  static #interpretarWMO(code) {
    if (code === 0)  return { estado: "Despejado",            icono: "☀️"  };
    if (code <= 2)   return { estado: "Parcialmente nublado", icono: "⛅"  };
    if (code === 3)  return { estado: "Nublado",              icono: "☁️"  };
    if (code <= 49)  return { estado: "Neblina",              icono: "🌫️" };
    if (code <= 59)  return { estado: "Llovizna",             icono: "🌦️" };
    if (code <= 69)  return { estado: "Lluvia",               icono: "🌧️" };
    if (code <= 79)  return { estado: "Nieve",                icono: "❄️"  };
    if (code <= 84)  return { estado: "Chubascos",            icono: "🌨️" };
    if (code <= 99)  return { estado: "Tormenta",             icono: "⛈️" };
    return { estado: "Desconocido", icono: "🌡️" };
  }
  renderCard() {
    return `
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <span style="font-size:1.5rem">${this.icono}</span>
            <strong> ${this.dia}</strong>
            <small class="text-muted d-block">${this.fecha}</small>
          </div>
          <div class="text-end">
            <p class="mb-0">${this.min}° / ${this.max}°</p>
            <small class="text-muted">${this.estado} · 💨 ${this.viento} km/h</small>
          </div>
        </div>
      </div>`;
  }
}

class Ciudad extends Ubicacion {
  #tempActual    = null;
  #vientoActual  = null;
  #estadoActual  = null;
  #iconoActual   = null;
  #pronostico    = [];
  #cargado       = false;

  constructor(id, nombre, lat, lon) {
    super(id, nombre, lat, lon); 
  }

  get tempActual()   { return this.#tempActual; }
  get vientoActual() { return this.#vientoActual; }
  get estadoActual() { return this.#estadoActual; }
  get iconoActual()  { return this.#iconoActual; }
  get pronostico()   { return this.#pronostico; }
  get cargado()      { return this.#cargado; }

  get tempRango() {
    if (!this.#pronostico.length) return "—";
    const hoy = this.#pronostico[0];
    return `${hoy.min}°/${hoy.max}°`;
  }
  async cargarClima() {
    const res  = await fetch(this._buildApiUrl()); 
    const data = await res.json();
    const d    = data.daily;

    this.#pronostico = d.time.map((fecha, i) =>
      new DiaClima(fecha, d.temperature_2m_min[i], d.temperature_2m_max[i], d.windspeed_10m_max[i], d.weathercode[i])
    );

    const actual = data.current_weather;
    this.#tempActual   = Math.round(actual.temperature);
    this.#vientoActual = Math.round(actual.windspeed);

    const diaActual    = new DiaClima(d.time[0], 0, 0, 0, actual.weathercode);
    this.#estadoActual = diaActual.estado;
    this.#iconoActual  = diaActual.icono;
    this.#cargado      = true;

    return this; 
  }
  estadoPredominante() {
    const conteo = {};
    this.#pronostico.forEach(dia => {
      conteo[dia.estado] = (conteo[dia.estado] || 0) + 1;
    });
    let ganador = "", cantidad = 0;
    for (const estado in conteo) {
      if (conteo[estado] > cantidad) {
        cantidad = conteo[estado];
        ganador  = estado;
      }
    }
    return { estado: ganador, dias: cantidad };
  }
  renderCard() {
    return `
      <div class="col g-4">
        <div class="card h-100">
          <div class="card-body card__body text-center">
            <div class="icono-clima">${this.#iconoActual}</div>
            <h5 class="card-title card__title">${this.nombre}</h5>
            <p class="card-text fw-bold">${this.tempRango}</p>
            <p class="card-text text-muted">${this.#estadoActual}</p>
            <p class="card-text"><small>💨 ${this.#vientoActual} km/h</small></p>
            <small class="text-muted">Hoy</small><br>
            <a class="btn btn-primary boton mt-2"
               href="detalles.html?ciudad=${this.id}"
               role="button">Detalle</a>
          </div>
        </div>
      </div>`;
  }

  renderDetalle() {
    const { estado, dias } = this.estadoPredominante();
    return `
      <div class="card-header header text-center py-4">
        <div style="font-size:4rem">${this.#iconoActual}</div>
        <h2>${this.nombre}</h2>
        <p class="fs-5">${this.#estadoActual} · ${this.#tempActual}°C</p>
        <p>🌡️ ${this.tempRango} &nbsp;|&nbsp; 💨 ${this.#vientoActual} km/h</p>
      </div>
      <div class="card mt-3">
        <div class="card-body">
          <h3>Pronóstico Semanal</h3>
          <p class="text-muted">Semana mayormente <strong>${estado}</strong>, ${dias} días</p>
          ${this.#pronostico.map(dia => dia.renderCard()).join("")}
        </div>
      </div>`;
  }
}
class CatalogoClima {
  #ciudades = [];
constructor(datos) {
    this.#ciudades = datos.map(d => new Ciudad(d.id, d.nombre, d.lat, d.lon));
  }
  async cargarTodas() {
    await Promise.all(this.#ciudades.map(c => c.cargarClima()));
    return this;
  }
buscarPorId(id) {
    return this.#ciudades.find(c => c.id === id) || null;
  }
  async cargarPorId(id) {
    const ciudad = this.buscarPorId(id);
    if (!ciudad) return null;
    if (!ciudad.cargado) await ciudad.cargarClima();
    return ciudad;
  }

  get todas() { return this.#ciudades; }
}
class RendererPagina {
  constructor(contenedor) {
    this.contenedor = contenedor;
  }

  mostrarCargando() {
    this.contenedor.innerHTML = `<p class="cargando">⏳ Cargando datos del clima...</p>`;
  }

  mostrarError(msg) {
    this.contenedor.innerHTML = `<p class="error">❌ ${msg}</p>`;
  }
  async render(catalogo) {
    throw new Error(`${this.constructor.name} debe implementar render()`);
  }
}
class RendererPrincipal extends RendererPagina {
  async render(catalogo) {
    this.mostrarCargando();
    try {
      await catalogo.cargarTodas();
      this.contenedor.innerHTML = catalogo.todas.map(c => c.renderCard()).join("");
    } catch (err) {
      this.mostrarError(`Error al cargar el clima: ${err.message}`);
    }
  }
}
class RendererDetalle extends RendererPagina {
  async render(catalogo) {
    this.mostrarCargando();
    try {
      const params = new URLSearchParams(window.location.search);
      const id     = Number(params.get("ciudad"));
      const ciudad = await catalogo.cargarPorId(id);

      if (!ciudad) {
        this.mostrarError("Ciudad no encontrada.");
        return;
      }

      this.contenedor.innerHTML = ciudad.renderDetalle();
    } catch (err) {
      this.mostrarError(`Error: ${err.message}`);
    }
  }
}
const DATOS_CIUDADES = [
  { id: 1,  nombre: "San Antonio",    lat: -33.5928, lon: -71.6083 },
  { id: 2,  nombre: "Santiago",       lat: -33.4489, lon: -70.6693 },
  { id: 3,  nombre: "Rancagua",       lat: -34.1703, lon: -70.7400 },
  { id: 4,  nombre: "Valparaíso",     lat: -33.0472, lon: -71.6127 },
  { id: 5,  nombre: "Viña del Mar",   lat: -33.0245, lon: -71.5518 },
  { id: 6,  nombre: "Concepción",     lat: -36.8270, lon: -73.0498 },
  { id: 7,  nombre: "La Serena",      lat: -29.9027, lon: -71.2519 },
  { id: 8,  nombre: "Valdivia",       lat: -39.8196, lon: -73.2452 },
  { id: 9,  nombre: "Los Andes",      lat: -32.8337, lon: -70.5997 },
  { id: 10, nombre: "Melipilla",      lat: -33.6889, lon: -71.2128 },
  { id: 11, nombre: "Isla de Pascua", lat: -27.1127, lon: -109.3497 },
  { id: 12, nombre: "Villarrica",     lat: -39.2833, lon: -72.2333 },
];
const catalogo = new CatalogoClima(DATOS_CIUDADES);

const elPrincipal = document.getElementById("principal");
const elDetalles  = document.getElementById("detalles");

if (elPrincipal) new RendererPrincipal(elPrincipal).render(catalogo);
if (elDetalles)  new RendererDetalle(elDetalles).render(catalogo);