/* ============================================================
   validacion.js — Lógica del documento de validación
   1. Carga automática del diploma desde /fotos/
   2. Animación de validez del certificado
   3. Verificación de código de certificado
   4. Subida temporal de diploma (vista previa)
   5. Imprimir / guardar PDF y copiar enlace
   ============================================================ */
(function () {
'use strict';

const $ = id => document.getElementById(id);

/* ---------- Códigos de certificado válidos (registro del instituto) ---------- */
const CODIGOS_VALIDOS = ['ICCP-2024-00872', 'ICCP202400872', 'ICCP-2021-2024'];
const CODIGO_OFICIAL = 'ICCP-2024-00872';

/* ---------- 1. Fecha actual en el sello y pie ---------- */
const hoy = new Date();
const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
$('fecha-actual').textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
$('sello-fecha').textContent = hoy.toLocaleDateString('es-GT');
$('anio').textContent = hoy.getFullYear();

/* ---------- 2. Animación de validez del certificado ---------- */
setTimeout(() => {
  const barra = $('barra-validez');
  const indicador = $('indicador-validez');
  const texto = $('texto-validez');
  indicador.classList.add('valido');
  texto.innerHTML = '✓ Certificado <strong>auténtico y válido</strong> — registrado en el sistema del instituto.';
  barra.style.borderLeftColor = '#1a7f37';
  // Mostrar sello digital sobre el diploma
  $('sello-digital').classList.add('visible');
}, 1800);

/* ---------- 3. Cargar diploma automáticamente desde /fotos/ ---------- */
const imgDiploma = $('img-diploma');
const placeholder = $('placeholder-diploma');
const marco = $('marco-diploma');

// Intenta cargar el diploma con varias extensiones en orden
const rutasPosibles = [
  'fotos/diploma.jpg',
  'fotos/diploma.jpeg',
  'fotos/diploma.png',
  'fotos/diploma.webp',
  'fotos/Diploma.jpg',
  'fotos/DIPLOMA.jpg'
];

function intentarCargarDiploma(indice) {
  if (indice >= rutasPosibles.length) return; // ninguna encontrada, se queda el placeholder
  const ruta = rutasPosibles[indice];
  const prueba = new Image();
  prueba.onload = () => {
    imgDiploma.src = ruta;
    imgDiploma.style.display = 'block';
    placeholder.style.display = 'none';
  };
  prueba.onerror = () => intentarCargarDiploma(indice + 1);
  prueba.src = ruta;
}
intentarCargarDiploma(0);

/* ---------- 4. Subir diploma temporalmente (vista previa) ---------- */
const btnSubir = $('btn-subir-diploma');
const inputDiploma = $('input-diploma');

btnSubir.addEventListener('click', () => inputDiploma.click());
inputDiploma.addEventListener('change', (e) => {
  const archivo = e.target.files[0];
  if (!archivo || !archivo.type.startsWith('image/')) return;
  const lector = new FileReader();
  lector.onload = (ev) => {
    imgDiploma.src = ev.target.result;
    imgDiploma.style.display = 'block';
    placeholder.style.display = 'none';
  };
  lector.readAsDataURL(archivo);
});

/* ---------- 5. Verificación de código ---------- */
const btnVerificar = $('btn-verificar');
const inputCodigo = $('input-codigo');
const resultado = $('resultado-verificacion');

function verificarCodigo() {
  const codigo = inputCodigo.value.trim().toUpperCase();
  resultado.className = 'resultado-verificacion';
  if (!codigo) {
    resultado.textContent = '⚠️ Introduce un código de certificado.';
    resultado.classList.add('error');
    return;
  }
  if (CODIGOS_VALIDOS.includes(codigo)) {
    resultado.innerHTML = '✓ <strong>Código válido.</strong> El certificado de <strong>Douglas Ismael Esteban Esquivel</strong> está registrado oficialmente (promoción 2021–2024).';
    resultado.classList.add('exito');
  } else {
    resultado.innerHTML = '✗ Código no encontrado en los registros. Verifica que esté escrito correctamente (ej: ' + CODIGO_OFICIAL + ').';
    resultado.classList.add('error');
  }
}
btnVerificar.addEventListener('click', verificarCodigo);
inputCodigo.addEventListener('keydown', (e) => { if (e.key === 'Enter') verificarCodigo(); });

/* ---------- 6. Imprimir / Guardar PDF ---------- */
$('btn-imprimir').addEventListener('click', () => window.print());

/* ---------- 7. Copiar enlace de validación ---------- */
$('btn-compartir').addEventListener('click', () => {
  const enlace = window.location.href + '?codigo=' + CODIGO_OFICIAL;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(enlace).then(() => {
      const btn = $('btn-compartir');
      const original = btn.textContent;
      btn.textContent = '✓ Enlace copiado';
      setTimeout(() => btn.textContent = original, 2000);
    });
  } else {
    prompt('Copia este enlace:', enlace);
  }
});

/* ---------- 8. Si la URL trae ?codigo=..., rellenar y verificar automáticamente ---------- */
const params = new URLSearchParams(window.location.search);
const codigoUrl = params.get('codigo');
if (codigoUrl) {
  inputCodigo.value = codigoUrl;
  verificarCodigo();
}

})();
