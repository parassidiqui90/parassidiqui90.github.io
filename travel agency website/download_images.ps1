# Create images directory if it doesn't exist
$imagesDir = ".\images"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir
}

# Function to download image
function Download-Image {
    param (
        [string]$Url,
        [string]$FilePath
    )
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0")
        $webClient.DownloadFile($Url, $FilePath)
        Write-Host "Successfully downloaded $FilePath"
    }
    catch {
        Write-Host "Failed to download $FilePath : $_"
    }
}

# Download images using reliable image URLs
$images = @{
    "hero-bg.jpg" = "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg"
    "dubai.jpg" = "https://images.pexels.com/photos/1534411/pexels-photo-1534411.jpeg"
    "england.jpg" = "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg"
    "norway.jpg" = "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg"
    "thailand.jpg" = "https://images.pexels.com/photos/1282667/pexels-photo-1282667.jpeg"
    "newyork.jpg" = "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg"
    "turkey.jpg" = "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg"
    "maldives.jpg" = "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg"
    "africa.jpg" = "https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg"
    "europe.jpg" = "https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg"
    "marina-bay.jpg" = "https://images.pexels.com/photos/1842332/pexels-photo-1842332.jpeg"
}

Write-Host "Downloading travel images..."
foreach ($image in $images.GetEnumerator()) {
    $filePath = Join-Path $imagesDir $image.Key
    Write-Host "Downloading $($image.Key)..."
    Download-Image -Url $image.Value -FilePath $filePath
}

Write-Host "All images downloaded successfully!"
