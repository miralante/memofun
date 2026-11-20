<#
  One-off: recorta las nueve señales del recuadro de la página 20 del libro
  (Itinerario Personal para la Empleabilidad) y las deja como miniaturas
  legibles para las tarjetas de la baraja de señalización.

  Uso:
    powershell -NoProfile -ExecutionPolicy Bypass -File recortar-senales-libro.ps1
    powershell -NoProfile -ExecutionPolicy Bypass -File recortar-senales-libro.ps1 -Banda 0,1080,1216,520

  Sin argumentos: recorta las nueve señales y las escribe en la carpeta de
  imágenes de la baraja.

  Por qué hay que procesarlas: la página es una FOTO de libro, así que cada
  señal sale con el papel de fondo gris, sombras y poco contraste. Aquí se
  recorta, se estiran los niveles por canal (el papel queda blanco y los
  colores se ven), se reescala a 512 px de lado largo y se guarda en JPEG.

  GDI+ no siempre acepta reescalar sobre el mismo fichero abierto: se
  dibuja sobre un bitmap nuevo y se guarda en un temporal, que sustituye al
  original al final. El codificador JPEG se crea DENTRO de la función de
  guardado: reutilizar los EncoderParameters entre ficheros da "Error
  generico en GDI+".
#>
param(
  [string]$Pagina = 'D:\img_memofun\ipp\tema2\pag20.jpeg',
  [string]$Salida = 'D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\memofun\assets\img\decks\fpb_sa_1_itinerario-personal-empleabilidad\tema-2-tecnicas-prevencion-proteccion\senalizacion-seguridad',
  [string]$Banda = '',
  [int]$Lado = 512,
  [int]$Calidad = 92
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# nombre, x, y, ancho, alto  (región GENEROSA en la página 1216x1600; dentro
# se recorta la señal exacta por color saturado)
$SENALES = @(
  @{ n = 'senal-inflamables';         x =  62; y = 1176; w = 126; h = 110 },
  @{ n = 'senal-caida';               x = 220; y = 1176; w = 126; h = 110 },
  @{ n = 'senal-prohibido-fumar';     x = 478; y = 1176; w = 120; h = 110 },
  @{ n = 'senal-no-tocar';            x = 628; y = 1176; w = 120; h = 110 },
  @{ n = 'senal-via-peatones';        x = 868; y = 1176; w = 120; h = 110 },
  @{ n = 'senal-proteccion-oido';     x = 1058; y = 1176; w = 120; h = 110 },
  @{ n = 'senal-extintor';            x = 168; y = 1378; w = 130; h = 114 },
  @{ n = 'senal-manguera-incendios';  x = 348; y = 1370; w = 130; h = 126 },
  @{ n = 'senal-telefono-salvamento'; x = 938; y = 1388; w = 130; h = 118 }
)

function Guardar-Jpeg($bitmap, $ruta, $calidad) {
  $cod = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
  $par = [System.Drawing.Imaging.EncoderParameters]::new(1)
  try {
    $par.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
      [System.Drawing.Imaging.Encoder]::Quality, [long]$calidad)
    $bitmap.Save($ruta, $cod, $par)
  } finally { $par.Dispose() }
}

# Estira los niveles por canal: el papel gris del libro pasa a blanco y los
# colores del pictograma se ven. Se hace sobre los píxeles (no con
# ColorMatrix, que deja la imagen en blanco) y EN SITIO: la función no
# devuelve nada (devolver el bitmap ensuciaría la salida de PowerShell).
function Niveles-Automaticos($bmp) {
  $rect = [System.Drawing.Rectangle]::new(0, 0, $bmp.Width, $bmp.Height)
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
    [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  try {
    $bytes = $data.Stride * $data.Height
    $buf = [System.Byte[]]::new($bytes)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $bytes)

    # Una sola curva, calculada sobre la LUMINANCIA, y aplicada igual a los
    # tres canales: así el tono no se tuerce (estirar cada canal por su lado
    # convierte el naranja en rojo y el azul en cian).
    $histY = [int[]]::new(256)
    for ($y = 0; $y -lt $data.Height; $y++) {
      $fila = $y * $data.Stride
      for ($x = 0; $x -lt $data.Width; $x++) {
        $i = $fila + $x * 3
        $Y = [int](0.299 * $buf[$i] + 0.587 * $buf[$i + 1] + 0.114 * $buf[$i + 2])
        $histY[$Y] = $histY[$Y] + 1
      }
    }
    $pixeles = $data.Width * $data.Height
    $total = 0; $lo = 0
    foreach ($n in $histY) { $total += $n; if ($total -ge ($pixeles * 0.02)) { $lo = $n; break } }
    $total = 0; $hi = 255
    for ($v = 255; $v -ge 0; $v--) {
      $total += $histY[$v]; if ($total -ge ($pixeles * 0.02)) { $hi = $v; break }
    }
    if ($hi -le $lo) { $hi = $lo + 1 }
    $ganancia = 255.0 / ($hi - $lo)

    $tabla = [int[]]::new(256)
    for ($v = 0; $v -lt 256; $v++) {
      $x = ($v - $lo) * $ganancia
      if ($x -lt 0) { $x = 0 } elseif ($x -gt 255) { $x = 255 }
      $tabla[$v] = [int][Math]::Round($x)
    }

    # saturación: se separa el gris (luminancia) del color y se amplía el croma
    $saturacion = 1.35
    for ($y = 0; $y -lt $data.Height; $y++) {
      $fila = $y * $data.Stride
      for ($x = 0; $x -lt $data.Width; $x++) {
        $i = $fila + $x * 3
        $b = [double]$tabla[$buf[$i + 2]]
        $g2 = [double]$tabla[$buf[$i + 1]]
        $r = [double]$tabla[$buf[$i]]
        $Y = 0.299 * $r + 0.587 * $g2 + 0.114 * $b
        $b = $Y + ($b - $Y) * $saturacion
        $g2 = $Y + ($g2 - $Y) * $saturacion
        $r = $Y + ($r - $Y) * $saturacion
        if ($b -lt 0) { $b = 0 } elseif ($b -gt 255) { $b = 255 }
        if ($g2 -lt 0) { $g2 = 0 } elseif ($g2 -gt 255) { $g2 = 255 }
        if ($r -lt 0) { $r = 0 } elseif ($r -gt 255) { $r = 255 }
        $buf[$i + 2] = [byte][Math]::Round($b)
        $buf[$i + 1] = [byte][Math]::Round($g2)
        $buf[$i]     = [byte][Math]::Round($r)
      }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $data.Scan0, $bytes)
  } finally {
    $bmp.UnlockBits($data)
  }
}

# Encuadra la señal dentro de la región: el papel del libro es casi gris y
# el rótulo es negro, así que lo único saturado es la señal. Se busca la caja
# de los píxeles con color y se recorta esa, con un margen.
function Encuadrar-Senal($bmp, [int]$margen = 4, [int]$umbral = 30) {
  $rect = [System.Drawing.Rectangle]::new(0, 0, $bmp.Width, $bmp.Height)
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
    [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  try {
    $bytes = $data.Stride * $data.Height
    $buf = [System.Byte[]]::new($bytes)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $bytes)
    $minX = $bmp.Width; $maxX = -1; $minY = $bmp.Height; $maxY = -1; $n = 0
    for ($y = 0; $y -lt $data.Height; $y++) {
      $fila = $y * $data.Stride
      for ($x = 0; $x -lt $data.Width; $x++) {
        $i = $fila + $x * 3
        $b = [int]$buf[$i + 2]; $g = [int]$buf[$i + 1]; $r = [int]$buf[$i]
        $max = [Math]::Max($r, [Math]::Max($g, $b))
        $min = [Math]::Min($r, [Math]::Min($g, $b))
        if (($max - $min) -ge $umbral) {
          $n = $n + 1
          if ($x -lt $minX) { $minX = $x }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($y -gt $maxY) { $maxY = $y }
        }
      }
    }
  } finally { $bmp.UnlockBits($data) }

  if ($n -lt 60) {
    return [System.Drawing.Rectangle]::new(0, 0, $bmp.Width, $bmp.Height)
  }
  $x0 = [Math]::Max(0, $minX - $margen); $y0 = [Math]::Max(0, $minY - $margen)
  $x1 = [Math]::Min($bmp.Width - 1, $maxX + $margen)
  $y1 = [Math]::Min($bmp.Height - 1, $maxY + $margen)
  return [System.Drawing.Rectangle]::new($x0, $y0, ($x1 - $x0 + 1), ($y1 - $y0 + 1))
}

if ($Banda) {
  $p = $Banda.Split(',')
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($Pagina)
  try {
    $rect = [System.Drawing.Rectangle]::new([int]$p[0], [int]$p[1], [int]$p[2], [int]$p[3])
    $bmp = [System.Drawing.Bitmap]::new($rect.Width, $rect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try { $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0,0,$rect.Width,$rect.Height), $rect, [System.Drawing.GraphicsUnit]::Pixel) }
    finally { $g.Dispose() }
    $destino = Join-Path 'D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\memofun\audit-out' 'banda.jpg'
    Guardar-Jpeg $bmp $destino $Calidad
    $bmp.Dispose()
    Write-Output ("banda -> " + $destino)
  } finally { $img.Dispose() }
  exit 0
}

if (-not (Test-Path -LiteralPath $Salida)) { New-Item -ItemType Directory -Path $Salida -Force | Out-Null }

$imgPagina = [System.Drawing.Image]::FromFile($Pagina)
try {
  foreach ($s in $SENALES) {
    $rect = [System.Drawing.Rectangle]::new($s.x, $s.y, $s.w, $s.h)
    $region = [System.Drawing.Bitmap]::new($s.w, $s.h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($region)
    try {
      $g.DrawImage($imgPagina, (New-Object System.Drawing.Rectangle 0,0,$s.w,$s.h), $rect,
        [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }

    $encuadre = Encuadrar-Senal $region
    $trozo = [System.Drawing.Bitmap]::new($encuadre.Width, $encuadre.Height,
      [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($trozo)
    try {
      $g.DrawImage($region, (New-Object System.Drawing.Rectangle 0,0,$encuadre.Width,$encuadre.Height),
        $encuadre, [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }
    $region.Dispose()

    Niveles-Automaticos $trozo

    $niveles = $trozo

    $largo = [Math]::Max($niveles.Width, $niveles.Height)
    $escala = $Lado / [double]$largo
    $ancho = [int][Math]::Round($niveles.Width * $escala)
    $alto  = [int][Math]::Round($niveles.Height * $escala)

    $final = [System.Drawing.Bitmap]::new($ancho, $alto)
    $g2 = [System.Drawing.Graphics]::FromImage($final)
    try {
      $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g2.Clear([System.Drawing.Color]::White)
      $g2.DrawImage($niveles, 0, 0, $ancho, $alto)
    } finally { $g2.Dispose() }
    $niveles.Dispose()

    $ruta = Join-Path $Salida ($s.n + '.jpg')
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('recorte-' + [System.IO.Path]::GetRandomFileName() + '.jpg')
    Guardar-Jpeg $final $tmp $Calidad
    Copy-Item -LiteralPath $tmp -Destination $ruta -Force
    Remove-Item -LiteralPath $tmp -Force
    $final.Dispose()
    Write-Output ("OK  " + $s.n + "  (" + $s.w + "x" + $s.h + " -> " + $ancho + "x" + $alto + ")")
  }
} finally { $imgPagina.Dispose() }
