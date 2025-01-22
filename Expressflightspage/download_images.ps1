# Create images directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "images"

# Function to download image
function Download-Image {
    param(
        [string]$Url,
        [string]$FilePath
    )
    
    try {
        Invoke-WebRequest -Uri $Url -OutFile $FilePath
        Write-Host "Downloaded: $FilePath"
    } catch {
        Write-Host "Failed to download: $FilePath"
    }
}

# Image URLs and their corresponding file names
$images = @{
    "images/hero-bg.jpg" = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop&q=80"
    "images/dubai.jpg" = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=80"
    "images/paris.jpg" = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop&q=80"
    "images/singapore.jpg" = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop&q=80"
    "images/newyork.jpg" = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80"
    "images/bali.jpg" = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop&q=80"
    "images/maldives.jpg" = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop&q=80"
    "images/santorini.jpg" = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop&q=80"
    "images/venice.jpg" = "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&q=80"
    "images/hotel1.jpg" = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80"
    "images/hotel2.jpg" = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80"
    "images/hotel3.jpg" = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop&q=80"
    "images/hotel4.jpg" = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80"
    "images/customer1.jpg" = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
    "images/customer2.jpg" = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80"
    "images/emirates.png" = "https://logowik.com/content/uploads/images/emirates-airlines-new3324.jpg"
    "images/qatar.png" = "https://logowik.com/content/uploads/images/qatar-airways3325.jpg"
    "images/singapore-airlines.png" = "https://logowik.com/content/uploads/images/singapore-airlines6153.jpg"
    "images/etihad.png" = "https://logowik.com/content/uploads/images/etihad-airways5096.jpg"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    Download-Image -Url $image.Value -FilePath $image.Key
}

Write-Host "All images downloaded successfully!"
