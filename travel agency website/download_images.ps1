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

# Download images using placeholder.com
$images = @{
    "hero-bg.jpg" = "https://via.placeholder.com/1600x900/2196f3/ffffff?text=Travel+Adventure"
    "dubai.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Dubai"
    "england.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=England"
    "norway.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Norway"
    "thailand.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Thailand"
    "newyork.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=New+York"
    "turkey.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Turkey"
    "maldives.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Maldives"
    "africa.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Africa"
    "europe.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Europe"
    "marina-bay.jpg" = "https://via.placeholder.com/800x600/2196f3/ffffff?text=Marina+Bay"
}

# Payment icons using placeholder.com
$paymentIcons = @{
    "visa.png" = "https://via.placeholder.com/100x60/ffffff/000000?text=Visa"
    "mastercard.png" = "https://via.placeholder.com/100x60/ffffff/000000?text=Mastercard"
    "amex.png" = "https://via.placeholder.com/100x60/ffffff/000000?text=Amex"
    "paypal.png" = "https://via.placeholder.com/100x60/ffffff/000000?text=PayPal"
}

Write-Host "Downloading travel images..."
foreach ($image in $images.GetEnumerator()) {
    $filePath = Join-Path $imagesDir $image.Key
    Write-Host "Downloading $($image.Key)..."
    Download-Image -Url $image.Value -FilePath $filePath
}

Write-Host "Downloading payment icons..."
foreach ($icon in $paymentIcons.GetEnumerator()) {
    $filePath = Join-Path $imagesDir $icon.Key
    Write-Host "Downloading $($icon.Key)..."
    Download-Image -Url $icon.Value -FilePath $filePath
}

Write-Host "All images downloaded successfully!"
