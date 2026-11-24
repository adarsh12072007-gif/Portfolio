import os
import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

src_path = r"c:\Users\hp\OneDrive\Documents\Portfolio_Adarsh\profile.jpg"
out_path = r"c:\Users\hp\OneDrive\Documents\Portfolio_Adarsh\profile_clean.png"
final_jpg = r"c:\Users\hp\OneDrive\Documents\Portfolio_Adarsh\profile.jpg"

print("Loading image...")
img = Image.open(src_path).convert("RGBA")

try:
    from rembg import remove
    print("Removing background with AI rembg...")
    # Remove background to get transparent subject
    subject = remove(img)
    subject.save(out_path)
    print("Subject cutout saved successfully.")
    
    # Create high-end professional studio background
    w, h = subject.size
    bg = Image.new("RGBA", (w, h), (17, 22, 18, 255)) # Dark aesthetic studio background
    
    # Create radial studio spotlight effect centered behind the person
    from PIL import ImageDraw
    spotlight = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(spotlight)
    
    # Draw soft subtle sage glow behind head
    center_x = w // 2
    center_y = int(h * 0.42)
    max_r = int(w * 0.6)
    
    for r in range(max_r, 0, -4):
        alpha = int(35 * (1 - r / max_r))
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], 
                     fill=(204, 213, 174, alpha))
                     
    bg = Image.alpha_composite(bg, spotlight)
    
    # Composite subject onto the clean professional background
    final_img = Image.alpha_composite(bg, subject).convert("RGB")
    
    # Slight color enhancement for crispness
    enhancer = ImageEnhance.Contrast(final_img)
    final_img = enhancer.enhance(1.08)
    
    sharpener = ImageEnhance.Sharpness(final_img)
    final_img = sharpener.enhance(1.15)
    
    final_img.save(final_jpg, quality=95)
    print("Professional profile photo updated successfully!")

except Exception as e:
    print("Rembg error or still installing:", e)
