from PIL import Image
import sys

def intelligent_transparent(image_path):
    print(f"Processing: {image_path}")
    try:
        img = Image.open(image_path).convert("RGBA")
    except Exception as e:
        print(f"Skipping {image_path}: {e}")
        return

    width, height = img.size
    pixels = img.load()
    
    # Visited mask (0 = unvisited, 1 = background)
    visited = set()
    
    # Queue for Flood Fill (Start from all 4 corners)
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    # Threshold - Adjust based on "No Shadow" results vs "Shadow" results
    # Since we have clean white background now, we can be strict
    threshold = 230 
    
    moves = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        x, y = queue.pop(0)
        
        if (x, y) in visited:
            continue
            
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
            
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        
        # Check if pixel is white enough
        if r > threshold and g > threshold and b > threshold:
            pixels[x, y] = (255, 255, 255, 0)
            
            for dx, dy in moves:
                nx, ny = x + dx, y + dy
                if (nx, ny) not in visited:
                    queue.append((nx, ny))
                    visited.add((nx, ny))
    
    img.save(image_path, "PNG")
    print(f"Finished {image_path}")

def main():
    targets = [
        "images/iso_logistics.png",
        "images/iso_consulting.png",
        "images/iso_ccm.png",
        "images/iso_finance.png",
        "images/iso_dx.png"
    ]
    
    for t in targets:
        intelligent_transparent(t)

if __name__ == "__main__":
    main()
