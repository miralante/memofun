<#
  One-off: monta una hoja de contactos (3x3) con las miniaturas de las nueve
  señales, para revisarlas de una vez sin abrir nueve ficheros.

  Uso:
    powershell -NoProfile -ExecutionPolicy Bypass -File hoja-contactos-senales.ps1
#>
param(
  [string]$Carpeta = 'D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\memofun\assets\img\decks\fpb_sa_1_itinerario-personal-empleabilidad\tema-2-tecnicas-prevencion-proteccion\senalizacion-seguridad',
  [string]$Salida = 'D:\apps\onedrive\jrodriguezgar\OneDrive\dev\git\Miralante\memofun\audit-out\contacto-senales.jpg',
  [int]$Lado = 240
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$orden = @(
  'senal-inflamables', 'senal-caida', 'senal-prohibido-fumar',
  'senal-no-tocar', 'senal-via-peatones', 'senal-proteccion-oido',
  'senal-extintor', 'senal-manguera-incendios', 'senal-telefono-salvamento'
)

$hoja = [System.Drawing.Bitmap]::new($Lado * 3, $Lado * 3, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($hoja)
try {
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  for ($i = 0; $i -lt $orden.Count; $i++) {
    $ruta = Join-Path $Carpeta ($orden[$i] + '.jpg')
    if (-not (Test-Path -LiteralPath $ruta)) { Write-Output ("FALTA " + $ruta); continue }
    $img = [System.Drawing.Image]::FromFile($ruta)
    try {
      $x = ($i % 3) * $Lado
      $y = [Math]::Floor($i / 3) * $Lado
      $g.DrawImage($img, $x, $y, $Lado, $Lado)
    } finally { $img.Dispose() }
  }
} finally { $g.Dispose() }

$cod = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$par = [System.Drawing.Imaging.EncoderParameters]::new(1)
try {
  $par.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
    [System.Drawing.Imaging.Encoder]::Quality, [long]90)
  $hoja.Save($Salida, $cod, $par)
} finally { $par.Dispose() }
$hoja.Dispose()
Write-Output ("hoja de contactos -> " + $Salida)
