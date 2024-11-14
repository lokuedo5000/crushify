import path from "path";
import fs from "fs";

import sharp from "sharp";
function changeExtension(filePath, newExtension) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    return path.join(dir, `${baseName}${newExtension}`);
  }
async function processImage(inputPath, outputPath, options = {}) {
  try {
    let sharpInstance = sharp(inputPath);

    // Aplicar redimensionamiento si se especifica
    if (options.resize) {
      const [width, height] = options.resize.split("x").map(Number);
      sharpInstance = sharpInstance.resize(width, height, {
        fit: options.fit || "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      });
    }

    // Aplicar rotación si se especifica
    if (options.rotate) {
      sharpInstance = sharpInstance.rotate(parseInt(options.rotate));
    }

    // Aplicar ajustes según el formato de salida
    switch (options.format) {
      case "jpg":
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({
          quality: options.quality || 80,
          mozjpeg: true,
        });
        break;

      case "png":
        sharpInstance = sharpInstance.png({
          quality: options.quality || 80,
          compressionLevel: options.compress || 9,
          palette: true,
        });
        break;

      case "webp":
        sharpInstance = sharpInstance.webp({
          quality: options.quality || 80,
          lossless: options.lossless || false,
        });
        break;

      case "gif":
        sharpInstance = sharpInstance.gif({
          colors: options.colors || 256,
          dither: options.dither || 1.0,
        });
        break;

      case "bmp":
        sharpInstance = sharpInstance.bmp({
          quality: options.quality || 100,
        });
        break;

      case "tiff":
        sharpInstance = sharpInstance.tiff({
          quality: options.quality || 80,
          compression: options.compression || "lzw",
          squash: options.squash || false,
        });
        break;

      case "heif":
      case "heic":
        try {
          // Verificar si el sistema soporta la codificación HEIF
          const info = sharp.format;
          if (!info.heif || !info.heif.output) {
            throw new Error(
              "El formato HEIF no está soportado en este sistema"
            );
          }

          sharpInstance = sharpInstance.heif({
            quality: options.quality || 80,
            compression: "av1", // Usar AV1 en lugar de HEVC
            lossless: false, // Deshabilitar lossless por defecto
          });

          // Verificar si el archivo de salida ya existe
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch (heifError) {
          console.error("Error con HEIF:", heifError);
          // Intentar fallback a JPEG si HEIF falla
          console.log("Intentando conversión alternativa a JPEG...");
          outputPath = changeExtension(outputPath, ".jpg");
          sharpInstance = sharpInstance.jpeg({
            quality: options.quality || 80,
            mozjpeg: true,
          });
        }
        break;
    }

    // Guardar la imagen procesada
    await sharpInstance.toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error procesando imagen ${inputPath}:`, error);
    return false;
  }
}

// Función para procesar el comando de imagen
async function processImageCommand(event, options) {
  try {
    if (options.directory === "directory") {
      // Procesar directorio
      const files = fs.readdirSync(options.input);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp|heif)$/i.test(file)
      );

      let processed = 0;
      for (const file of imageFiles) {
        const inputPath = path.join(options.input, file);
        const outputPath = path.join(
          options.to,
          changeExtension(file, `.${options.format}`)
        );

        if (await processImage(inputPath, outputPath, options)) {
          processed++;
          if (options.remove) {
            fs.unlinkSync(inputPath);
          }
        }
      }

      return `Se procesaron ${processed} de ${imageFiles.length} imágenes`;
    } else {
      // Procesar archivo único
      const success = await processImage(options.input, options.to, options);
      if (success) {
        if (options.remove) {
          fs.unlinkSync(options.input);
        }
        return `Imagen procesada exitosamente: ${options.to}`;
      } else {
        return `Error al procesar la imagen: ${options.input}`;
      }
    }
  } catch (error) {
    throw new Error(`Error al procesar imagen: ${error.message}`);
  }
}

// Función para manejar errores de comandos
function handleCommandError(event, error) {
  const errorMessage = `Error: ${error.message}`;
  event.reply(errorMessage, ".txt");
  return "_no";
}

// Función para validar opciones
function validateOptions(options) {
  if (!options.input) {
    throw new Error("No se especificó una imagen de entrada.");
  }

  if (options.compress && (options.compress < 0 || options.compress > 100)) {
    throw new Error("El valor de compresión debe estar entre 0 y 100.");
  }

  if (options.resize) {
    const [width, height] = options.resize.split("x").map(Number);
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      throw new Error(
        "Las dimensiones de redimensionamiento deben ser números positivos."
      );
    }
  }

  // Validar formato específico según el tipo
  switch (options.format) {
    case "gif":
      if (options.colors && (options.colors < 2 || options.colors > 256)) {
        throw new Error(
          "El número de colores para GIF debe estar entre 2 y 256."
        );
      }
      break;
    case "tiff":
      if (
        options.compression &&
        !["lzw", "deflate", "jpeg", "ccittfax4"].includes(options.compression)
      ) {
        throw new Error("Método de compresión TIFF no válido.");
      }
      break;
  }

  return true;
}

// Función auxiliar para crear directorios si no existen
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Modificar el export para incluir las funciones auxiliares
export {
  processImageCommand,
  handleCommandError,
  validateOptions,
  ensureDirectoryExists,
};
