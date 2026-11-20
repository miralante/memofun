<#
  One-off: reescala un JPEG para que su lado largo no pase de 1024 px
  (limite de las miniaturas de carta) y lo vuelve a guardar como JPEG real.

  Uso:
    powershell -NoProfile -ExecutionPolicy Bypass -File redimensionar-imagen.ps1 <ruta.jpg> [maxLado]

  Notas:
  - GDI+ no siempre acepta reescalar sobre el mismo fichero abierto: se
    dibuja sobre un bitmap nuevo y se guarda en un temporal, que sustituye
    al original al final.
  - El codificador JPEG se crea DENTRO de la funcion de guardado: reutilizar
    los EncoderParameters entre ficheros da "Error generico en GDI+".
#>
param(
  [Parameter(Mandatory = $true)][string]$Path,
  [int]$MaxLado = 1024,
  [int]$Calidad = 88
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "No existe: $Path"
  exit 1
}

# La imagen se carga en memoria: con Image::FromFile el fichero queda
# bloqueado por GDI+ y despues no se puede sustituir.
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $Path).Path)
$ms = [System.IO.MemoryStream]::new($bytes)
$img = [System.Drawing.Image]::FromStream($ms)
try {
  $largo = [Math]::Max($img.Width, $img.Height)
  if ($largo -le $MaxLado) {
    Write-Output ("OK (sin cambio) {0}x{1}  {2}" -f $img.Width, $img.Height, (Split-Path $Path -Leaf))
    exit 0
  }

  $escala = $MaxLado / [double]$largo
  $ancho = [int][Math]::Round($img.Width * $escala)
  $alto  = [int][Math]::Round($img.Height * $escala)

  $destino = [System.Drawing.Bitmap]::new($ancho, $alto)
  try {
    $g = [System.Drawing.Graphics]::FromImage($destino)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, 0, 0, $ancho, $alto)
    } finally { $g.Dispose() }

    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('resize-' + [System.IO.Path]::GetRandomFileName() + '.jpg')
    try {
      $cod = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
      $par = [System.Drawing.Imaging.EncoderParameters]::new(1)
      $par.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
        [System.Drawing.Imaging.Encoder]::Quality, [long]$Calidad)
      $destino.Save($tmp, $cod, $par)
    } finally {
      if ($par) { $par.Dispose() }
    }

    Copy-Item -LiteralPath $tmp -Destination $Path -Force
    Remove-Item -LiteralPath $tmp -Force
    Write-Output ("OK {0}x{1} -> {2}x{3}  {4}" -f $img.Width, $img.Height, $ancho, $alto, (Split-Path $Path -Leaf))
  } finally { $destino.Dispose() }
} finally { $img.Dispose(); $ms.Dispose() }
