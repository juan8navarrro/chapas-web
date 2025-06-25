let chapas = [];
let paginaActual = 1;
const chapasPorPagina = 24;

async function cargarChapas() {
  const res = await fetch("chapas_clean.json");
  chapas = await res.json();
  inicializarFiltros();
  aplicarFiltrosYMostrar();
  renderTopCountries();
  renderTopRegiones();
  renderFirstLastChapas();
}


// — Formatea 'YYYY-MM-DD' a 'D de mes de YYYY' en español
function formatFecha(fechaStr) {
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date(fechaStr);
  const day   = d.getDate();
  const month = meses[d.getMonth()];
  const year  = d.getFullYear();
  return `${day} de ${month} de ${year}`;
}


function inicializarFiltros() {
  const paises = [...new Set(chapas.map(c => c.Pais))].sort();
  const filtroPais = document.getElementById("filtro-pais");
  filtroPais.innerHTML = '<option value="">Todos los países</option>';
  paises.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    filtroPais.appendChild(option);
  });

  // Resetear página cuando se aplican filtros
  filtroPais.addEventListener("change", () => { paginaActual = 1; actualizarRegionCiudad(); });
  document.getElementById("filtro-region").addEventListener("change", () => { paginaActual = 1; actualizarCiudad(); });
  document.getElementById("filtro-ciudad").addEventListener("change", () => { paginaActual = 1; aplicarFiltrosYMostrar(); });
  document.getElementById("buscador-marca").addEventListener("input", () => { paginaActual = 1; aplicarFiltrosYMostrar(); });
  document.getElementById("btn-limpiar").addEventListener("click", () => { paginaActual = 1; limpiarFiltros(); });
}

function actualizarRegionCiudad() {
  const paisSel = document.getElementById("filtro-pais").value;
  const regiones = [...new Set(chapas.filter(c => c.Pais === paisSel).map(c => c.Region))].sort();
  const regionSelect = document.getElementById("filtro-region");
  regionSelect.innerHTML = '<option value="">Todas las regiones</option>';
  regiones.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionSelect.appendChild(opt);
  });
  actualizarCiudad();
  aplicarFiltrosYMostrar();
}

function actualizarCiudad() {
  const paisSel = document.getElementById("filtro-pais").value;
  const regionSel = document.getElementById("filtro-region").value;
  const ciudades = [...new Set(chapas.filter(c => c.Pais === paisSel && (!regionSel || c.Region === regionSel)).map(c => c.Ciudad))].sort();
  const ciudadSelect = document.getElementById("filtro-ciudad");
  ciudadSelect.innerHTML = '<option value="">Todas las ciudades</option>';
  ciudades.forEach(ci => {
    const opt = document.createElement("option");
    opt.value = ci;
    opt.textContent = ci;
    ciudadSelect.appendChild(opt);
  });
  aplicarFiltrosYMostrar();
}

function limpiarFiltros() {
  document.getElementById("filtro-pais").value = "";
  document.getElementById("filtro-region").value = "";
  document.getElementById("filtro-ciudad").value = "";
  document.getElementById("buscador-marca").value = "";
  actualizarRegionCiudad();
  aplicarFiltrosYMostrar();
}

function aplicarFiltrosYMostrar() {
  const pais = document.getElementById("filtro-pais").value;
  const region = document.getElementById("filtro-region").value;
  const ciudad = document.getElementById("filtro-ciudad").value;
  const marca = document.getElementById("buscador-marca").value.toLowerCase();

  let filtradas = chapas.filter(c =>
    (!pais || c.Pais === pais) &&
    (!region || c.Region === region) &&
    (!ciudad || c.Ciudad === ciudad) &&
    (!marca || c.Marca.toLowerCase().includes(marca))
  );

  mostrarPaginador(filtradas);
  mostrarChapas(filtradas);
}

function mostrarPaginador(lista) {
  const contenedor = document.getElementById("paginador");
  contenedor.innerHTML = "";

  const totalPaginas = Math.ceil(lista.length / chapasPorPagina);
  if (totalPaginas <= 1) return;

  const anterior = document.createElement("button");
  anterior.textContent = "Anterior";
  anterior.className = "paginador-btn";
  anterior.disabled = paginaActual === 1;
  anterior.onclick = () => { paginaActual--; aplicarFiltrosYMostrar(); };
  contenedor.appendChild(anterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "paginador-btn" + (i === paginaActual ? " activo" : "");
    btn.onclick = () => { paginaActual = i; aplicarFiltrosYMostrar(); };
    contenedor.appendChild(btn);
  }

  const siguiente = document.createElement("button");
  siguiente.textContent = "Siguiente";
  siguiente.className = "paginador-btn";
  siguiente.disabled = paginaActual === totalPaginas;
  siguiente.onclick = () => { paginaActual++; aplicarFiltrosYMostrar(); };
  contenedor.appendChild(siguiente);
}

function mostrarChapas(lista) {
  const contenedor = document.getElementById("galeria-contenido");
  contenedor.innerHTML = "";
  const inicio = (paginaActual - 1) * chapasPorPagina;
  const chapasPagina = lista.slice(inicio, inicio + chapasPorPagina);

  chapasPagina.forEach(chapa => {
    const div = document.createElement("div");
    div.className = "chapa";
    div.innerHTML = `

      <img src="images/${chapa.ID}.png" alt="Chapa" class="chapa-img">
      <div><strong>${chapa.Nombre}</strong></div>
      <div>${chapa.Marca}</div>
      <div>${chapa.Ciudad} - ${chapa.Pais}</div>
      <div>ID: ${chapa.ID}</div>
    `;
    contenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", cargarChapas);
 // Al clic en logo o título: volver a página 1 y limpiar filtros
  document.getElementById("logo").addEventListener("click", () => {
    paginaActual = 1;
    limpiarFiltros();
  });
  document.getElementById("titulo").addEventListener("click", () => {
    paginaActual = 1;
    limpiarFiltros();
  // --- Click en logo/título para volver a galería limpia ---
const logo = document.getElementById("logo");
const titulo = document.getElementById("titulo");
if (logo) logo.addEventListener("click", () => {
  paginaActual = 1;
  limpiarFiltros();
  document.getElementById("galeria").style.display = "block";
  document.getElementById("estadisticas").style.display = "none";
});
if (titulo) titulo.addEventListener("click", () => {
  paginaActual = 1;
  limpiarFiltros();
  document.getElementById("galeria").style.display = "block";
  document.getElementById("estadisticas").style.display = "none";
});
  });
;


// --- Renderizar Top 10 países ---
function renderTopCountries() {
  const counts = {};
  chapas.forEach(c => {
    const pais = c.Pais;
    counts[pais] = (counts[pais] || 0) + 1;
  });
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const lista = document.getElementById('top-paises-list');
  if (!lista) return;
  lista.innerHTML = '';
  top.forEach(([pais, count]) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <img src="Banderas_paises/${pais}.png" alt="Bandera ${pais}" class="flag">
    <span class="pais">${pais}</span>
    <span class="count">${count}</span>
  `;
  lista.appendChild(li);
});


}


// --- Renderizar Top 10 regiones (ignorando cadenas vacías) ---
function renderTopRegiones() {
  const counts = {};
  chapas.forEach(c => {
    if (c.Region && c.Region.trim() !== "") {
      counts[c.Region] = (counts[c.Region] || 0) + 1;
    }
  });
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const lista = document.getElementById('top-regiones-list');
  if (!lista) return;
  lista.innerHTML = '';
  top.forEach(([region, count]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="Banderas_regiones/${region}.png" alt="Bandera ${region}" class="flag">
      <span class="pais">${region}</span>
      <span class="count">${count}</span>
    `;
    lista.appendChild(li);
  });
}

// — Render de la primera y última chapa —
function renderFirstLastChapas() {
  const cont = document.getElementById("primeras-chapas-container");
  if (!cont || chapas.length === 0) return;
  cont.innerHTML = "";
  const primero = chapas[0];
  const ultimo  = chapas[chapas.length - 1];
  [ { label: "Primera chapa", data: primero },
    { label: "Última chapa",  data: ultimo  } ].forEach(item => {

    const div = document.createElement("div");
    div.className = "chapa";
    div.innerHTML = `
      <div class="chapa-title">${item.label}</div>
      <img src="images/${item.data.ID}.png" alt="Chapa ${item.data.ID}" class="chapa-img">
      <div><strong>${item.data.Nombre}</strong></div>
      <div>${item.data.Marca}</div>
    
      <div class="chapa-date">${formatFecha(item.data.Fecha)}</div>
    `;
    cont.appendChild(div);
  });
}
