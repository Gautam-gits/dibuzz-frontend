Add-Type -AssemblyName System.Drawing
$source = "C:\Users\Manan\Downloads\WhatsApp Image 2026-07-29 at 11.48.30 AM.jpeg"
$dest = "C:\Users\Manan\Desktop\dibuzz-digital\public\logo.png"

$img = [System.Drawing.Image]::FromFile($source)
$w = $img.Width
$h = [int]($img.Height * 0.74)

$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$cropped = $img.Clone($rect, $img.PixelFormat)
$img.Dispose()

$cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

Write-Host "Logo successfully cropped and saved to public/logo.png!"
