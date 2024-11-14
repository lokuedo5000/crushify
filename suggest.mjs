import PathUtils from "../../utils/craftshelf-fy/js/pathUtils.mjs";
const { __dirname } = PathUtils.getFileDetails(import.meta.url);

import path from "path";
import fs from "fs";
import fileReader from "../../utils/craftshelf-fy/js/fileReader.mjs";

import { processImageCommand, handleCommandError } from "./aux.mjs";

function isFileOrDirectory(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return "directory";
    } else if (stats.isFile()) {
      return "file";
    } else {
      return "other";
    }
  } catch (error) {
    return "not found";
  }
}

function parseArgs(args, ext = ".jpg") {
  const options = {
    input: null,
    to: null,
    compress: null,
    remove: false,
    ext,
    directory: null,
    compression: null,
  };

  args.forEach((arg) => {
    if (arg.startsWith("--to=")) {
      options.to = arg.split("=")[1];
    } else if (arg.startsWith("--compress=")) {
      options.compress = parseInt(arg.split("=")[1]);
    } else if (arg === "--remove") {
      options.remove = true;
    } else if (!arg.startsWith("--")) {
      options.input = arg;
      options.directory = isFileOrDirectory(arg);
      if (options.to == null) {
        if (options.directory == "directory") {
          options.to = options.input;
        } else {
          options.to = changeExtension(options.input, ext);
        }
      }
    }
  });

  if (!options.input) {
    throw new Error("No se especificó una imagen de entrada.");
  }

  return options;
}

function changeExtension(filePath, newExtension) {
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  return path.join(dir, `${baseName}${newExtension}`);
}

const commands = [
  {
    name: "package",
    description: "Crushify package data",
    icon: "📦",
    aliases: ["ch", "cf"],
    execute: function (event, objCommand, args) {
      const readfile = fileReader.readFileSync(
        path.join(__dirname, "package.json")
      );

      const aliasMap = {
        "-v": "version",
        v: "version",
        "-d": "dependencies",
        d: "dependencies",
        "-dev": "devDependencies",
        dev: "devDependencies",
        "-s": "scripts",
        s: "scripts",
      };

      // Si no hay argumentos, devolver el contenido completo
      if (!args || args.length === 0) {
        event.reply(readfile, ".json");
        return "_no";
      }

      // Buscar claves en package.json usando los args y alias
      const responses = args.map((arg) => {
        const key = aliasMap[arg] || arg; // Usa el alias o el arg directamente
        const data = readfile[key];

        // Verifica si el valor existe en el archivo, sino da un aviso
        return data !== undefined
          ? { [key]: data }
          : `No se encontró la información para "${arg}"`;
      });

      // Enviar respuestas procesadas
      event.reply(responses.length > 1 ? responses : responses[0], ".json");

      return "_no";
    },
  },
  {
    name: "help",
    description: "Mostrar comandos disponibles",
    icon: "?",
    aliases: ["h", "hp", "commands", "?"],
    execute: function (event) {
      const readfile = fileReader.readFileSync(
        path.join(__dirname, "md", "help.md")
      );
      event.reply(readfile, ".md");
      return "_no";
    },
  },
  {
    name: "jpg",
    description: "Convertir imágenes a formato JPG",
    icon: "🖼️",
    aliases: ["jpeg", "jpge"],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".jpg");
        options.format = "jpg";
        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "png",
    description: "Convertir imágenes a formato PNG",
    icon: "📷",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".png");
        options.format = "png";
        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "webp",
    description: "Convertir imágenes a formato WebP",
    icon: "🌐",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".webp");
        options.format = "webp";
        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "gif",
    description: "Convertir imágenes a formato GIF",
    icon: "🎞",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".gif");
        options.format = "gif";

        // Procesar opciones específicas de GIF
        const colorsArg = args.find((arg) => arg.startsWith("--colors="));
        if (colorsArg) {
          options.colors = parseInt(colorsArg.split("=")[1]);
        }

        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "bmp",
    description: "Convertir imágenes a formato BMP",
    icon: "🎨",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".bmp");
        options.format = "bmp";
        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "tiff",
    description: "Convertir imágenes a formato TIFF",
    icon: "📷",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".tiff");
        options.format = "tiff";

        // Procesar opciones específicas de TIFF
        const compressionArg = args.find((arg) =>
          arg.startsWith("--compression=")
        );
        if (compressionArg) {
          options.compression = compressionArg.split("=")[1];
        }

        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "heif",
    description: "Convertir imágenes a formato HEIF",
    icon: "🖌",
    aliases: ["heic"],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args, ".heif");
        options.format = "heif";

        // Procesar opciones específicas de HEIF
        if (args.includes("--lossless")) {
          options.lossless = true;
        }

        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
  {
    name: "resize",
    description: "Redimensionar imágenes manteniendo formato",
    icon: "📐",
    aliases: [],
    execute: async function (event, objCommand, args) {
      try {
        const options = parseArgs(args);
        const sizeArg = args.find((arg) => arg.startsWith("--size="));
        if (!sizeArg) {
          throw new Error(
            "Debe especificar el tamaño con --size=WxH (ejemplo: --size=800x600)"
          );
        }
        options.resize = sizeArg.split("=")[1];
        options.format = path.extname(options.input).substring(1);
        return processImageCommand(event, options);
      } catch (error) {
        return handleCommandError(event, error);
      }
    },
  },
];

export default commands;
