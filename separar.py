import os
from PIL import Image, ImageEnhance, ImageFilter

def mejorar_y_guardar(img, numero_foto):
    # Escalar 1.5x con filtro de alta calidad Lanczos para suavizar pixeles
    w, h = img.size
    img = img.resize((int(w * 1.5), int(h * 1.5)), Image.Resampling.LANCZOS)
    
    # Aplicar máscara de enfoque profesional (quita lo borroso sin meter ruido)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=125, threshold=3))
    
    # Realzar ligeramente el contraste y color
    img = ImageEnhance.Contrast(img).enhance(1.05)
    img = ImageEnhance.Color(img).enhance(1.04)
    
    ruta_destino = f"assets/foto{numero_foto}.jpg"
    img.convert("RGB").save(ruta_destino, "JPEG", quality=95)
    print(f"Lista y mejorada: {ruta_destino}")

# 1. collage1.jpg (2 fotos verticales) -> foto14 y foto15
if os.path.exists("assets/collage1.jpg"):
    img = Image.open("assets/collage1.jpg")
    w, h = img.size
    mejorar_y_guardar(img.crop((0, 0, w, h // 2)), 14)
    mejorar_y_guardar(img.crop((0, h // 2, w, h)), 15)

# 2. collage2.jpg (2 fotos verticales) -> foto16 y foto17
if os.path.exists("assets/collage2.jpg"):
    img = Image.open("assets/collage2.jpg")
    w, h = img.size
    mejorar_y_guardar(img.crop((0, 0, w, h // 2)), 16)
    mejorar_y_guardar(img.crop((0, h // 2, w, h)), 17)

# 3. 'collage 3.jpg' (4 fotos en cuadrícula 2x2) -> foto18, foto19, foto20 y foto21
ruta_c3 = "assets/collage 3.jpg" if os.path.exists("assets/collage 3.jpg") else "assets/collage3.jpg"
if os.path.exists(ruta_c3):
    img = Image.open(ruta_c3)
    w, h = img.size
    mw, mh = w // 2, h // 2
    mejorar_y_guardar(img.crop((0, 0, mw, mh)), 18)
    mejorar_y_guardar(img.crop((mw, 0, w, mh)), 19)
    mejorar_y_guardar(img.crop((0, mh, mw, h)), 20)
    mejorar_y_guardar(img.crop((mw, mh, w, h)), 21)

# 4. collage4.jpg (3 fotos verticales) -> foto22, foto23 y foto24
if os.path.exists("assets/collage4.jpg"):
    img = Image.open("assets/collage4.jpg")
    w, h = img.size
    t = h // 3
    mejorar_y_guardar(img.crop((0, 0, w, t)), 22)
    mejorar_y_guardar(img.crop((0, t, w, t * 2)), 23)
    mejorar_y_guardar(img.crop((0, t * 2, w, h)), 24)

print("¡Todas las fotos fueron separadas con exito!")
