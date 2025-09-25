import { Archivo, Actividad } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener todos los archivos
export const getArchivos = async (req, res) => {
  try {
    const { id_actividad } = req.query;
    const whereClause = {};
    
    if (id_actividad) {
      whereClause.id_actividad = id_actividad;
    }
    
    const archivos = await Archivo.findAll({
      where: whereClause,
      include: [{
        model: Actividad,
        as: 'actividad'
      }],
      order: [['fecha_subida', 'DESC']]
    });
    
    res.json(archivos);
  } catch (error) {
    handleError(res, error, 'Error al obtener archivos');
  }
};

// Obtener un archivo por ID
export const getArchivoById = async (req, res) => {
  try {
    const { id } = req.params;
    const archivo = await Archivo.findByPk(id, {
      include: [{
        model: Actividad,
        as: 'actividad'
      }]
    });
    
    if (!archivo) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    res.json(archivo);
  } catch (error) {
    handleError(res, error, 'Error al obtener archivo');
  }
};

// Obtener archivos por actividad
export const getArchivosByActividad = async (req, res) => {
  try {
    const { id_actividad } = req.params;
    
    const archivos = await Archivo.findAll({
      where: { id_actividad },
      order: [['fecha_subida', 'DESC']]
    });
    
    res.json(archivos);
  } catch (error) {
    handleError(res, error, 'Error al obtener archivos de la actividad');
  }
};

// Subir un archivo
export const uploadArchivo = async (req, res) => {
  try {
    const { id_actividad } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
    }
    
    // Verificar que la actividad existe
    const actividad = await Actividad.findByPk(id_actividad);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }
    
    const archivo = await Archivo.create({
      id_actividad,
      nombre_original: req.file.originalname,
      nombre_almacenado: req.file.filename,
      ruta_almacenamiento: req.file.path,
      tipo_mime: req.file.mimetype,
      tamano_bytes: req.file.size
    });
    
    // Incluir la actividad en la respuesta
    const archivoConActividad = await Archivo.findByPk(archivo.id_archivo, {
      include: [{
        model: Actividad,
        as: 'actividad'
      }]
    });
    
    res.status(201).json(archivoConActividad);
  } catch (error) {
    handleError(res, error, 'Error al subir archivo');
  }
};

// Descargar un archivo
export const downloadArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 [Backend] downloadArchivo - ID recibido:', id);
    
    const archivo = await Archivo.findByPk(id);
    console.log('📁 [Backend] Archivo encontrado en BD:', {
      id: archivo?.id_archivo,
      nombre_original: archivo?.nombre_original,
      nombre_almacenado: archivo?.nombre_almacenado,
      ruta_almacenamiento: archivo?.ruta_almacenamiento,
      tipo_mime: archivo?.tipo_mime,
      tamano_bytes: archivo?.tamano_bytes
    });
    
    if (!archivo) {
      console.log('❌ [Backend] Archivo no encontrado en BD');
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    // Verificar que el archivo existe en el sistema de archivos
    try {
      await fs.access(archivo.ruta_almacenamiento);
      console.log('✅ [Backend] Archivo existe en sistema de archivos:', archivo.ruta_almacenamiento);
    } catch (error) {
      console.log('❌ [Backend] Archivo no encontrado en sistema de archivos:', {
        ruta: archivo.ruta_almacenamiento,
        error: error.message
      });
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }
    
    // Configurar headers para la descarga
    console.log('📤 [Backend] Configurando headers para descarga');
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre_original}"`);
    res.setHeader('Content-Type', archivo.tipo_mime);
    res.setHeader('Content-Length', archivo.tamano_bytes);
    
    console.log('📦 [Backend] Headers configurados:', {
      'Content-Disposition': `attachment; filename="${archivo.nombre_original}"`,
      'Content-Type': archivo.tipo_mime,
      'Content-Length': archivo.tamano_bytes
    });
    
    // Enviar el archivo
    console.log('🚀 [Backend] Enviando archivo...');
    res.sendFile(path.resolve(archivo.ruta_almacenamiento));
  } catch (error) {
    console.error('❌ [Backend] Error en downloadArchivo:', error);
    handleError(res, error, 'Error al descargar archivo');
  }
};

// Eliminar un archivo
export const deleteArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const archivo = await Archivo.findByPk(id);
    
    if (!archivo) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    // Eliminar el archivo del sistema de archivos
    try {
      await fs.unlink(archivo.ruta_almacenamiento);
    } catch (error) {
      console.warn('No se pudo eliminar el archivo del sistema de archivos:', error.message);
    }
    
    // Eliminar el registro de la base de datos
    await archivo.destroy();
    
    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar archivo');
  }
};

// Obtener información de un archivo sin descargarlo
export const getArchivoInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const archivo = await Archivo.findByPk(id, {
      include: [{
        model: Actividad,
        as: 'actividad'
      }]
    });
    
    if (!archivo) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    // Verificar si el archivo existe en el sistema de archivos
    let existeEnServidor = true;
    try {
      await fs.access(archivo.ruta_almacenamiento);
    } catch (error) {
      existeEnServidor = false;
    }
    
    res.json({
      ...archivo.toJSON(),
      existe_en_servidor: existeEnServidor
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener información del archivo');
  }
};