# Guía de Comandos de Conversión de Imágenes

Esta herramienta proporciona una suite completa de comandos para convertir y manipular imágenes en diferentes formatos. A continuación, se detalla cada comando y sus opciones disponibles.

## 🌄 Comando JPEG
**Nombre:** `jpge` (o `jpg`)  
**Descripción:** Convierte imágenes a formato JPEG/JPG con compresión optimizada.

### Uso Básico:
```bash
jpge imagen.png
jpge carpeta_imagenes --to=carpeta_salida
```

### Opciones:
- `--compress=80` : Define el nivel de compresión (1-100)
- `--remove` : Elimina el archivo original después de la conversión
- `--to=ruta` : Especifica la ruta de salida

### Ejemplos:
```bash
# Convertir una imagen con compresión específica
jpge imagen.png --compress=85

# Convertir y eliminar original
jpge imagen.png --remove

# Convertir un directorio completo
jpge ./fotos --to=./fotos_jpg --compress=90
```

## 🖼 Comando PNG
**Nombre:** `png`  
**Descripción:** Convierte imágenes a formato PNG sin pérdida de calidad.

### Uso Básico:
```bash
png imagen.jpg
png carpeta_imagenes --to=pngs
```

### Opciones:
- `--compress=9` : Nivel de compresión (0-9)
- `--remove` : Elimina original
- `--to=ruta` : Ruta de salida

### Ejemplos:
```bash
# Conversión básica
png imagen.jpg

# Máxima compresión sin pérdida
png imagen.jpg --compress=9
```

## 📸 Comando WebP
**Nombre:** `webp`  
**Descripción:** Convierte a formato WebP, optimizado para web.

### Uso Básico:
```bash
webp imagen.jpg
webp carpeta --to=webp_optimizadas
```

### Opciones:
- `--compress=80` : Calidad de compresión (1-100)
- `--lossless` : Usar compresión sin pérdida
- `--remove` : Eliminar original
- `--to=ruta` : Ruta de salida

### Ejemplos:
```bash
# Conversión con alta calidad
webp imagen.png --compress=90

# Conversión sin pérdida
webp imagen.png --lossless
```

## 🎞 Comando GIF
**Nombre:** `gif`  
**Descripción:** Convierte imágenes a formato GIF.

### Uso Básico:
```bash
gif imagen.jpg
gif carpeta_imagenes --to=gifs
```

### Opciones:
- `--colors=256` : Número de colores (2-256)
- `--remove` : Eliminar original
- `--to=ruta` : Ruta de salida

### Ejemplos:
```bash
# Conversión básica
gif imagen.jpg

# Conversión con paleta reducida
gif imagen.jpg --colors=128
```

## 🎨 Comando BMP
**Nombre:** `bmp`  
**Descripción:** Convierte imágenes a formato BMP sin compresión.

### Uso Básico:
```bash
bmp imagen.jpg
bmp carpeta --to=bmps
```

### Opciones:
- `--remove` : Eliminar original
- `--to=ruta` : Ruta de salida

## 📷 Comando TIFF
**Nombre:** `tiff`  
**Descripción:** Convierte a TIFF con alta calidad.

### Uso Básico:
```bash
tiff imagen.jpg
tiff carpeta --to=tiffs
```

### Opciones:
- `--compress=lzw` : Tipo de compresión (none/lzw/deflate)
- `--remove` : Eliminar original
- `--to=ruta` : Ruta de salida

## 🖌 Comando HEIF
**Nombre:** `heif`  
**Descripción:** Convierte a formato HEIF/HEIC.

### Uso Básico:
```bash
heif imagen.jpg
heif carpeta --to=heif_images
```

### Opciones:
- `--quality=80` : Calidad (1-100)
- `--remove` : Eliminar original
- `--to=ruta` : Ruta de salida

## Opciones Globales
Estas opciones funcionan en todos los comandos:

### Procesamiento de Directorios
```bash
[comando] carpeta_entrada --to=carpeta_salida
```

### Control de Calidad
```bash
--compress=N    # Nivel de compresión
--quality=N     # Calidad de salida
```

### Gestión de Archivos
```bash
--remove        # Eliminar originales
--to=ruta       # Especificar destino
```

### Dimensiones
```bash
--resize=800x600    # Redimensionar imagen
--fit=contain       # Modo de ajuste (contain/cover/fill)
```

## Ejemplos de Uso Avanzado

### Conversión por Lotes con Compresión
```bash
jpge ./fotos --to=./compressed --compress=85 --remove
```

### Redimensionar y Convertir
```bash
webp imagen.jpg --resize=1920x1080 --compress=90
```

### Convertir Directorio Manteniendo Estructura
```bash
png ./fotos --to=./png_backup --compress=9
```

### Optimizar para Web
```bash
webp ./imagenes --to=./web_optimized --compress=80 --resize=800x600
```

## Notas Importantes

1. **Formatos Soportados de Entrada:**
   - JPG/JPEG
   - PNG
   - WebP
   - GIF
   - BMP
   - TIFF
   - HEIF/HEIC

2. **Consideraciones de Rendimiento:**
   - Mayor compresión = mayor tiempo de procesamiento
   - Las conversiones por lotes pueden ser intensivas en recursos

3. **Mejores Prácticas:**
   - Hacer respaldo antes de usar --remove
   - Usar compresión moderada para balance calidad/tamaño
   - Verificar espacio en disco para grandes lotes