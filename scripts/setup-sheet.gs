/**
 * ROOTS LIFE — Setup inicial de Google Sheet.
 *
 * INSTRUCCIONES:
 * 1. Extensiones → Apps Script.
 * 2. Pegá este archivo entero.
 * 3. Guardá (Ctrl+S) y ejecutá `setupRootsSheet`.
 *
 * Re-ejecutarlo BORRA todas las filas de capsulas y productos,
 * y las repobla con el catálogo completo (5 cápsulas · 18 productos).
 */

var DATA_ROWS = 200;

function setupRootsSheet() {
  var ss = SpreadsheetApp.getActive();

  setupCapsulasTab_(ss);
  setupProductosTab_(ss);
  removeDefaultSheet_(ss);

  SpreadsheetApp.getUi().alert(
    'Setup completo.\n\n' +
      '✓ 5 cápsulas (4 remeras + 1 buzos)\n' +
      '✓ 18 productos (12 remeras + 6 buzos)\n' +
      '✓ Validaciones, dropdowns y checkboxes aplicados',
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
    ['buzos', 'Buzos', 'Sección · Línea estable',
      'Líneas Tipográfica, Locals y Kobe. Prendas de siempre, por fuera de las cápsulas.',
      5, true],
  ];
  tab.getRange(2, 1, sample.length, headers.length).setValues(sample);

  tab.getRange(2, 6, DATA_ROWS, 1).insertCheckboxes();

  var orderRule = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 99)
    .setAllowInvalid(false)
    .build();
  tab.getRange(2, 5, DATA_ROWS, 1).setDataValidation(orderRule);

  tab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff');
  tab.setFrozenRows(1);

  tab.setColumnWidth(1, 140);
  tab.setColumnWidth(2, 180);
  tab.setColumnWidth(3, 200);
  tab.setColumnWidth(4, 380);
  tab.setColumnWidth(5, 70);
  tab.setColumnWidth(6, 80);

  tab.getRange(1, 4, DATA_ROWS, 1).setWrap(true);

  tab.getRange('A1').setNote('ID único URL-friendly. No cambiar si hay productos asignados.');
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

  var INSTALL_3_8000 = 'o 3 cuotas sin interés de $8.000';
  var INSTALL_3_8666 = 'o 3 cuotas sin interés de $8.666';

  var sample = [
    // ─── NUMEROLOGÍA ─────────────────────────────────────
    ['pegasus-2222', 'numerologia', 'Pegasus 2222',
      'Edición limitada · 80 unidades numeradas',
      24000, INSTALL_3_8000,
      'Halftone denso sobre algodón peinado negro. Pegaso recortado contra un grid global — símbolo de libertad sin perder el rumbo.',
      true, true, true, true, true, true,
      'Negro:#0E0E0E | Blanco:#FAFAFA',
      '/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.webp | /images/remeras/Numerología/Numerología - Pegasus 2222 - blanca.webp | /images/remeras/Numerología/Numerología - Pegasus 2222 - Close up - negra.webp',
      'new',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía halftone a 2 tintas | Edición:80 unidades numeradas',
      true],
    ['snake-3333', 'numerologia', 'Snake 3333',
      'Edición limitada · 60 unidades numeradas',
      26000, INSTALL_3_8666,
      'Serpiente estampada con halftone orgánico sobre fondo crudo. Código 33 33 — transformación constante, piel que se renueva. Serigrafía a tres tintas.',
      false, true, true, true, true, false,
      'Crudo:#E3DBC8',
      '/images/remeras/Numerología/Numerología - Snake 3333.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía a 3 tintas | Edición:60 unidades numeradas',
      true],
    ['butterfly-5555', 'numerologia', 'Butterfly 5555',
      'Edición limitada · 50 unidades numeradas',
      26000, INSTALL_3_8666,
      'Mariposa fragmentada en pixel-halftone. El 55 55 simboliza ciclo completo — muerte y renacimiento. Estampa central con halftone denso.',
      false, true, true, true, true, false,
      'Crudo:#E3DBC8',
      '/images/remeras/Numerología/Numerología - Butterfly 5555.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía halftone a 2 tintas | Edición:50 unidades numeradas',
      true],

    // ─── SOUTH COAST ─────────────────────────────────────
    ['no-bad-days', 'south-coast', 'No Bad Days',
      'South Coast Series · Drop actual',
      24000, INSTALL_3_8000,
      'Serigrafía a tres tintas sobre algodón orgánico. Un llamado a la costa del sur — días sin apuro, sol y viento. Parte de la cápsula South Coast.',
      false, true, true, true, true, true,
      'Crema:#FAFAFA',
      '/images/remeras/South Coast/South Coast - No bad days.webp',
      '',
      'Material:Algodón orgánico · 160 g/m² | Estampa:Serigrafía a 3 tintas',
      true],
    ['chill-and-repeat', 'south-coast', 'Chill & Repeat',
      'South Coast Series · Drop actual',
      24000, INSTALL_3_8000,
      'Ritual costero: chill y repetir. Tipografía bold sobre algodón orgánico, con acentos en tintas suaves.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/South Coast/South Coast - Chill & Repeat.webp',
      '',
      'Material:Algodón orgánico · 160 g/m² | Estampa:Serigrafía a 2 tintas',
      true],
    ['wind-it', 'south-coast', 'Wind It',
      'South Coast Series · Drop actual',
      24000, INSTALL_3_8000,
      'El viento como protagonista. Estampa con movimiento, guiño a las tardes frescas de la costa patagónica.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/South Coast/South Coast - Wind it.webp',
      'new',
      'Material:Algodón orgánico · 160 g/m² | Estampa:Serigrafía a 3 tintas',
      true],

    // ─── POSTALES ───────────────────────────────────────
    ['cerro-la-flor', 'postales', 'Cerro la Flor',
      'Postales · Drop actual',
      24000, INSTALL_3_8000,
      'El Cerro la Flor vestido en halftone. Una postal gráfica del sur — vista familiar convertida en símbolo.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/Postales/Postales - Cerro la Flor.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía halftone monotono',
      true],
    ['costanera-comodoro', 'postales', 'Costanera Comodoro',
      'Postales · Drop actual',
      24000, INSTALL_3_8000,
      'La costanera que conoce cualquiera que vive en Comodoro — atardeceres largos, viento y mar abierto.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA | Negro:#0E0E0E',
      '/images/remeras/Postales/Postales - Costanera comodoro.webp | /images/remeras/Postales/Postales - Costanera comodoro - negra.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía halftone',
      true],
    ['trenes-rada-tilly', 'postales', 'Trenes de Rada Tilly',
      'Postales · Drop actual',
      24000, INSTALL_3_8000,
      'Los trenes de Rada Tilly — nostalgia ferroviaria del sur, vistos con grafismo contemporáneo.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/Postales/Postales - trenes de rada tilly.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía a 2 tintas',
      true],

    // ─── ROOTS ──────────────────────────────────────────
    ['build', 'roots', 'Build',
      'ROOTS · Drop actual',
      24000, INSTALL_3_8000,
      'Build — construir. Primera palabra de la trilogía fundacional ROOTS. Tipografía y símbolo compactos.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/ROOTS/ROOTS - Build.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía monocromo',
      true],
    ['dream', 'roots', 'Dream',
      'ROOTS · Drop actual',
      24000, INSTALL_3_8000,
      'Dream — soñar. Segunda palabra de la trilogía fundacional ROOTS. Minimalismo tipográfico.',
      false, true, true, true, true, false,
      'Crema:#FAFAFA',
      '/images/remeras/ROOTS/ROOTS - Dream.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía monocromo',
      true],
    ['explore', 'roots', 'Explore',
      'ROOTS · Drop actual',
      24000, INSTALL_3_8000,
      'Explore — explorar. Tercera palabra de la trilogía fundacional ROOTS. Disponible en dos colores.',
      false, true, true, true, true, false,
      'Negro:#0E0E0E | Blanco:#FAFAFA',
      '/images/remeras/ROOTS/ROOTS - Explore - negra.webp | /images/remeras/ROOTS/ROOTS - Explore - blanca.webp',
      '',
      'Material:Algodón peinado 30/1 · 180 g/m² | Estampa:Serigrafía monocromo',
      true],

    // ─── BUZOS ──────────────────────────────────────────
    ['invisible-forces', 'buzos', 'Invisible Forces',
      'Buzo · Línea Tipográfica',
      52000, 'o 3 cuotas sin interés de $17.333',
      'Buzo de frisa 360 g/m² con estampa tipográfica contenida. Pieza estable de la colección — tipografía limpia sobre algodón de peso pleno.',
      false, true, true, true, true, false,
      'Arena:#D9C9A8',
      '/images/buzos/buzos roots-15.webp',
      '',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía tipográfica | Línea:Tipográfica',
      true],
    ['south-club', 'buzos', 'South Club',
      'Buzo · Línea Locals',
      52000, 'o 3 cuotas sin interés de $17.333',
      'Miembro del South Club. Gráfica clásica de club costero, estampada sobre buzo pesado. Línea Locals.',
      false, true, true, true, true, false,
      'Negro:#0E0E0E',
      '/images/buzos/buzos roots-19.webp',
      'new',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía a 2 tintas | Línea:Locals',
      true],
    ['locals-rust', 'buzos', 'Locals Rust',
      'Buzo · Línea Locals',
      54000, 'o 3 cuotas sin interés de $18.000',
      'Los locales de siempre. Estampa rust sobre frisa de peso pleno — una pieza que se usa fuerte.',
      false, true, true, true, true, false,
      'Oxido:#B4542F',
      '/images/buzos/buzos roots-29.webp',
      '',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía monocromo rust | Línea:Locals',
      true],
    ['kobe-sky', 'buzos', 'Kobe Sky',
      'Buzo · Línea Kobe',
      54000, 'o 3 cuotas sin interés de $18.000',
      'Kobe Sky — celestes amplios, tributo a tardes largas de cancha. Línea Kobe es homenaje puro.',
      false, true, true, true, true, false,
      'Celeste:#A8C5D6',
      '/images/buzos/buzos roots-40.webp',
      '',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía a 3 tintas | Línea:Kobe',
      true],
    ['invisible-forces-coal', 'buzos', 'Invisible Forces Coal',
      'Buzo · Línea Tipográfica',
      52000, 'o 3 cuotas sin interés de $17.333',
      'Variante carbón del Invisible Forces. Misma tipografía, paleta más dura.',
      false, true, true, true, true, false,
      'Carbón:#2B2B2B',
      '/images/buzos/buzos roots-16.webp',
      '',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía tipográfica | Línea:Tipográfica',
      true],
    ['kobe-natural', 'buzos', 'Kobe Natural',
      'Buzo · Línea Kobe',
      54000, 'o 3 cuotas sin interés de $18.000',
      'Kobe en tono natural — la versión más discreta de la línea. Serigrafía suave sobre base crema.',
      false, true, true, true, true, false,
      'Natural:#EAE1CC',
      '/images/buzos/buzos roots-37.webp',
      'sold',
      'Material:Algodón frisado 360 g/m² | Estampa:Serigrafía monocromo | Línea:Kobe',
      true],
  ];
  tab.getRange(2, 1, sample.length, headers.length).setValues(sample);

  // Dropdown en capsule_id (col 2) — lee IDs de capsulas dinámicamente
  var capsulas = ss.getSheetByName('capsulas');
  var capsuleIdsRange = capsulas.getRange('A2:A100');
  var capsuleRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(capsuleIdsRange, true)
    .setAllowInvalid(false)
    .build();
  tab.getRange(2, 2, DATA_ROWS, 1).setDataValidation(capsuleRule);

  // Checkboxes para sizes en UNA llamada (cols 8-13)
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

  // Header formato
  tab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');
  tab.setFrozenRows(1);
  tab.setFrozenColumns(3);

  tab.getRange(1, 8, DATA_ROWS + 1, 6).setHorizontalAlignment('center');
  for (var c = 8; c <= 13; c++) tab.setColumnWidth(c, 50);

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

  [4, 7, 14, 15, 17].forEach(function (col) {
    tab.getRange(1, col, DATA_ROWS, 1).setWrap(true);
  });

  tab.getRange('A1').setNote('Identificador URL-friendly único. Si lo cambiás, el link del producto se rompe.');
  tab.getRange('B1').setNote('Dropdown — seleccioná cápsula de la pestaña "capsulas".');
  tab.getRange('E1').setNote('Solo números sin puntos ni $. Ej: 24000.');
  tab.getRange('N1').setNote('Colores formato Nombre:#HEX separados por | . Ej: Negro:#0E0E0E | Blanco:#FAFAFA');
  tab.getRange('O1').setNote('URLs separadas por | . La primera es la principal.');
  tab.getRange('P1').setNote('new = nuevo · sold = agotado · vacío = sin etiqueta.');
  tab.getRange('Q1').setNote('Etiqueta:Valor separadas por | . Ej: Material:Algodón 180g | Estampa:3 tintas');
  tab.getRange('R1').setNote('Destildar = producto oculto.');
}

function removeDefaultSheet_(ss) {
  ['Hoja 1', 'Sheet1', 'Hoja1'].forEach(function (name) {
    var s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });
}

// ─────────────────────────────────────────────────────────
// EMAILS — setup independiente. Ejecutar UNA sola vez.
// No toca capsulas ni productos.
// Si la pestaña ya existe, ejecutá extendEmailsTab() para agregar columnas nuevas.
// ─────────────────────────────────────────────────────────
function setupEmailsTab() {
  var ss = SpreadsheetApp.getActive();
  var tab = ss.getSheetByName('emails');
  if (tab) {
    SpreadsheetApp.getUi().alert(
      'La pestaña "emails" ya existe. Para agregar las columnas nuevas (used_at) ejecutá extendEmailsTab().',
    );
    return;
  }

  tab = ss.insertSheet('emails');

  var headers = ['timestamp', 'email', 'source', 'discount_code', 'used_at', 'user_registered'];
  tab.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Header style
  tab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff');
  tab.setFrozenRows(1);

  // Widths
  tab.setColumnWidth(1, 180); // timestamp
  tab.setColumnWidth(2, 280); // email
  tab.setColumnWidth(3, 140); // source
  tab.setColumnWidth(4, 180); // discount_code
  tab.setColumnWidth(5, 180); // used_at
  tab.setColumnWidth(6, 120); // user_registered

  // Notas
  tab.getRange('A1').setNote('Fecha/hora de la suscripción (ISO 8601 UTC).');
  tab.getRange('C1').setNote('De dónde vino el email: newsletter, checkout, signup.');
  tab.getRange('D1').setNote('Código de descuento único generado para esta persona.');
  tab.getRange('E1').setNote('Fecha/hora en que el código fue usado en una compra. Vacío = no usado.');
  tab.getRange('F1').setNote('TRUE si el email ya corresponde a un usuario registrado en el sitio.');

  SpreadsheetApp.getUi().alert(
    'Pestaña "emails" creada.\n\n' +
      '✓ 6 columnas (timestamp, email, source, discount_code, used_at, user_registered)\n' +
      '✓ Formato header aplicado\n\n' +
      'Ya podés recibir suscripciones desde el sitio.',
  );
}

// ─────────────────────────────────────────────────────────
// EXTEND EMAILS — agregar columna used_at si ya tenés la tab antigua (5 cols).
// Segura de ejecutar varias veces: si ya existe la columna, no duplica.
// ─────────────────────────────────────────────────────────
function extendEmailsTab() {
  var ss = SpreadsheetApp.getActive();
  var tab = ss.getSheetByName('emails');
  if (!tab) {
    SpreadsheetApp.getUi().alert(
      'No existe la pestaña "emails". Ejecutá primero setupEmailsTab().',
    );
    return;
  }

  var lastCol = tab.getLastColumn();
  var headers = tab.getRange(1, 1, 1, lastCol).getValues()[0];

  // Verificar si ya tiene used_at
  if (headers.indexOf('used_at') !== -1) {
    SpreadsheetApp.getUi().alert('La columna "used_at" ya existe. No hice cambios.');
    return;
  }

  // Insertar columna E (posición 5) antes de user_registered
  var userRegisteredIdx = headers.indexOf('user_registered');
  var insertAt = userRegisteredIdx !== -1 ? userRegisteredIdx + 1 : lastCol + 1;

  tab.insertColumnBefore(insertAt);
  tab.getRange(1, insertAt).setValue('used_at');
  tab.getRange(1, insertAt)
    .setFontWeight('bold')
    .setBackground('#1a1a1a')
    .setFontColor('#ffffff');
  tab.setColumnWidth(insertAt, 180);
  tab.getRange(1, insertAt).setNote(
    'Fecha/hora en que el código fue usado en una compra. Vacío = no usado.',
  );

  SpreadsheetApp.getUi().alert(
    'Columna "used_at" agregada exitosamente en posición ' + insertAt + '.',
  );
}
