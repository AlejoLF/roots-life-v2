/**
 * ROOTS LIFE — Setup inicial de Google Sheet.
 *
 * INSTRUCCIONES:
 * 1. Abrí una Sheet vacía nueva.
 * 2. Menú Extensiones → Apps Script.
 * 3. Borrá el código default, pegá este archivo entero.
 * 4. Guardá (Ctrl+S), dale un nombre al proyecto.
 * 5. Arriba elegí la función `setupRootsSheet` y apretá "Ejecutar".
 * 6. Autorizá permisos cuando te lo pida.
 */

// Rango operativo — suficiente para cualquier catálogo de ropa.
// No usamos 998 porque Apps Script se queda sin tiempo con tantas operaciones.
var DATA_ROWS = 200;

function setupRootsSheet() {
  var ss = SpreadsheetApp.getActive();

  setupCapsulasTab_(ss);
  setupProductosTab_(ss);
  removeDefaultSheet_(ss);

  SpreadsheetApp.getUi().alert(
    'Setup completo.\n\n' +
      '✓ Pestaña "capsulas" con 4 cápsulas de ejemplo\n' +
      '✓ Pestaña "productos" con 2 productos de ejemplo\n' +
      '✓ Validaciones, dropdowns y checkboxes aplicados\n\n' +
      'Ahora podés compartir esta Sheet con el service account.',
  );
}

// ─────────────────────────────────────────────────────────
// CAPSULAS
// ─────────────────────────────────────────────────────────
function setupCapsulasTab_(ss) {
  var tab = ss.getSheetByName('capsulas') || ss.insertSheet('capsulas', 0);
  tab.clear();

  var headers = ['id', 'name', 'caption', 'description', 'order', 'active'];
  tab.getRange(1, 1, 1, headers.length).setValues([headers]);

  var sample = [
    ['numerologia', 'Numerología', 'Cápsula 01 · Drop actual',
      'Tres códigos, tres historias. 22 22, 33 33 y 55 55 — símbolos urbanos convertidos en serigrafía.',
      1, true],
    ['south-coast', 'South Coast Series', 'Cápsula 02 · Drop actual',
      'Días sin apuro. Sol, viento y costa — la vida al ritmo del sur patagónico.',
      2, true],
    ['postales', 'Postales', 'Cápsula 03 · Drop actual',
      'Paisajes de Comodoro Rivadavia traducidos a serigrafía. Cerro la Flor, costanera y trenes de Rada Tilly.',
      3, true],
    ['roots', 'ROOTS', 'Cápsula 04 · Drop actual',
      'La esencia de la marca en tres palabras: Build, Dream, Explore. Piezas fundacionales.',
      4, true],
  ];
  tab.getRange(2, 1, sample.length, headers.length).setValues(sample);

  // Checkbox en columna "active"
  tab.getRange(2, 6, DATA_ROWS, 1).insertCheckboxes();

  // Number validation en "order"
  var orderRule = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 99)
    .setAllowInvalid(false)
    .build();
  tab.getRange(2, 5, DATA_ROWS, 1).setDataValidation(orderRule);

  // Formato header
  tab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff');
  tab.setFrozenRows(1);

  // Widths
  tab.setColumnWidth(1, 140);
  tab.setColumnWidth(2, 180);
  tab.setColumnWidth(3, 200);
  tab.setColumnWidth(4, 380);
  tab.setColumnWidth(5, 70);
  tab.setColumnWidth(6, 80);

  // Wrap en description (solo rango de datos)
  tab.getRange(1, 4, DATA_ROWS, 1).setWrap(true);

  // Notas clave en headers
  tab.getRange('A1').setNote('ID único URL-friendly (minúsculas, sin espacios, guiones). No cambiar IDs existentes si hay productos asignados.');
  tab.getRange('F1').setNote('Destildar = cápsula oculta del sitio sin borrarla.');
}

// ─────────────────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────────────────
function setupProductosTab_(ss) {
  var tab = ss.getSheetByName('productos') || ss.insertSheet('productos', 1);
  tab.clear();

  var headers = [
    'slug', 'capsule_id', 'title', 'caption', 'price', 'installments',
    'description', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'colors', 'images',
    'badge', 'features', 'active',
  ];
  tab.getRange(1, 1, 1, headers.length).setValues([headers]);

  var sample = [
    ['pegasus-2222', 'numerologia', 'Pegasus 2222',
      'Edición limitada · 80 unidades numeradas', 24000,
      'o 3 cuotas sin interés de $8.000',
      'Halftone denso sobre algodón peinado negro. Pegaso recortado contra un grid global — símbolo de libertad sin perder el rumbo.',
      true, true, true, true, true, true,
      'Negro:#0E0E0E | Blanco:#FAFAFA',
      '/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.webp | /images/remeras/Numerología/Numerología - Pegasus 2222 - blanca.webp',
      'new',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía halftone a 2 tintas | Edición:80 unidades numeradas',
      true],
    ['no-bad-days', 'south-coast', 'No Bad Days',
      'South Coast Series · Drop actual', 24000,
      'o 3 cuotas sin interés de $8.000',
      'Serigrafía a tres tintas sobre algodón orgánico. Un llamado a la costa del sur — días sin apuro, sol y viento.',
      true, true, true, true, true, true,
      'Crema:#FAFAFA',
      '/images/remeras/South Coast/South Coast - No bad days.webp',
      '',
      'Material:Algodón orgánico · 160 g/m² | Estampa:Serigrafía a 3 tintas',
      true],
  ];
  tab.getRange(2, 1, sample.length, headers.length).setValues(sample);

  // Dropdown en capsule_id (col 2) — lee IDs de la pestaña capsulas dinámicamente
  var capsulas = ss.getSheetByName('capsulas');
  var capsuleIdsRange = capsulas.getRange('A2:A100');
  var capsuleRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(capsuleIdsRange, true)
    .setAllowInvalid(false)
    .build();
  tab.getRange(2, 2, DATA_ROWS, 1).setDataValidation(capsuleRule);

  // Checkboxes para sizes — UNA sola llamada contigua cols 8-13
  tab.getRange(2, 8, DATA_ROWS, 6).insertCheckboxes();

  // Checkbox en active (col 18)
  tab.getRange(2, 18, DATA_ROWS, 1).insertCheckboxes();

  // Dropdown en badge (col 16)
  var badgeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['', 'new', 'sold'], true)
    .setAllowInvalid(true)
    .build();
  tab.getRange(2, 16, DATA_ROWS, 1).setDataValidation(badgeRule);

  // Number validation en price (col 5)
  var priceRule = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setAllowInvalid(false)
    .build();
  tab.getRange(2, 5, DATA_ROWS, 1).setDataValidation(priceRule);

  // Formato header
  tab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');
  tab.setFrozenRows(1);
  tab.setFrozenColumns(3);

  // Sizes cols 8-13 — alineación + ancho chico
  tab.getRange(1, 8, DATA_ROWS + 1, 6).setHorizontalAlignment('center');
  for (var c = 8; c <= 13; c++) tab.setColumnWidth(c, 50);

  // Widths del resto
  tab.setColumnWidth(1, 140);
  tab.setColumnWidth(2, 130);
  tab.setColumnWidth(3, 160);
  tab.setColumnWidth(4, 200);
  tab.setColumnWidth(5, 80);
  tab.setColumnWidth(6, 220);
  tab.setColumnWidth(7, 400);
  tab.setColumnWidth(14, 240);
  tab.setColumnWidth(15, 380);
  tab.setColumnWidth(16, 90);
  tab.setColumnWidth(17, 380);
  tab.setColumnWidth(18, 70);

  // Wrap en textos largos — SOLO rango de datos, no columnas enteras
  [4, 7, 14, 15, 17].forEach(function (col) {
    tab.getRange(1, col, DATA_ROWS, 1).setWrap(true);
  });

  // Notas clave en headers
  tab.getRange('A1').setNote('Identificador URL-friendly único. Ej: pegasus-2222. Si lo cambiás, el link se rompe.');
  tab.getRange('B1').setNote('Dropdown — seleccioná cápsula de la pestaña "capsulas".');
  tab.getRange('E1').setNote('Solo números sin puntos ni $. Ej: 24000.');
  tab.getRange('N1').setNote('Colores formato Nombre:#HEX separados por | . Ej: Negro:#0E0E0E | Blanco:#FAFAFA');
  tab.getRange('O1').setNote('URLs separadas por | . La primera es principal.');
  tab.getRange('P1').setNote('new = nuevo · sold = agotado · vacío = sin etiqueta.');
  tab.getRange('Q1').setNote('Etiqueta:Valor separadas por | . Ej: Material:Algodón 180g | Estampa:3 tintas');
  tab.getRange('R1').setNote('Destildar = producto oculto.');
}

// ─────────────────────────────────────────────────────────
// Elimina la "Hoja 1" default vacía si existe
// ─────────────────────────────────────────────────────────
function removeDefaultSheet_(ss) {
  ['Hoja 1', 'Sheet1', 'Hoja1'].forEach(function (name) {
    var s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });
}
