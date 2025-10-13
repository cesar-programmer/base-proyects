import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image, File, ExternalLink } from 'lucide-react';
import fileService from '../services/fileService';
import archivoService from '../services/archivoService';
import { toast } from 'react-toastify';

const ModalVisualizarArchivo = ({ isOpen, onClose, archivo }) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && archivo) {
      loadFile();
    }
    
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, archivo]);

  const resolveMimetype = (arch) => arch?.mimetype || arch?.tipo_mime;
  const resolveName = (arch) => arch?.originalName || arch?.nombre_original || arch?.filename || 'Archivo';
  const resolveSize = (arch) => arch?.size || arch?.tamaño;
  const resolveFilename = (arch) => arch?.filename;

  const loadFile = async () => {
    if (!archivo) return;
    
    const mimetype = resolveMimetype(archivo);
    setLoading(true);
    setError(null);
    
    try {
      // Para PDFs e imágenes, cargar el archivo para visualización
      if (isViewableFile(mimetype)) {
        let blob;
        if (archivo.id) {
          blob = await archivoService.viewArchivo(archivo.id);
        } else if (resolveFilename(archivo)) {
          blob = await fileService.viewFile(resolveFilename(archivo));
        }
        if (blob) {
          const url = URL.createObjectURL(blob);
          setFileUrl(url);
        } else {
          setError('No se pudo obtener el archivo para visualizar');
        }
      }
    } catch (error) {
      console.error('Error al cargar archivo:', error);
      setError('Error al cargar el archivo');
      toast.error('Error al cargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const isViewableFile = (mimetype) => {
    return mimetype?.includes('pdf') || mimetype?.includes('image');
  };

  const isPDF = (mimetype) => {
    return mimetype?.includes('pdf');
  };

  const isImage = (mimetype) => {
    return mimetype?.includes('image');
  };

  const handleDownload = async () => {
    if (!archivo) return;
    
    try {
      let blob;
      if (archivo.id) {
        blob = await archivoService.downloadArchivo(archivo.id);
      } else if (resolveFilename(archivo)) {
        blob = await fileService.downloadFile(resolveFilename(archivo));
      }
      if (!blob) throw new Error('No se pudo descargar el archivo');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resolveName(archivo);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Archivo descargado');
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const getFileIcon = (mimetype) => {
    if (isPDF(mimetype)) return <FileText className="w-6 h-6 text-red-500" />;
    if (isImage(mimetype)) return <Image className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Tamaño desconocido';
    return fileService.formatFileSize(bytes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[85vh] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {getFileIcon(resolveMimetype(archivo))}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {resolveName(archivo)}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(resolveSize(archivo))} • {resolveMimetype(archivo) || 'Tipo desconocido'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Descargar archivo"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Cargando archivo...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <File className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium mb-2">Error al cargar el archivo</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar archivo
              </button>
            </div>
          )}

          {!loading && !error && archivo && (
            <>
              {/* PDF Viewer */}
              {isPDF(resolveMimetype(archivo)) && fileUrl && (
                <div className="h-full">
                  <iframe
                    src={fileUrl}
                    className="w-full h-full border-0"
                    title={resolveName(archivo)}
                  />
                </div>
              )}

              {/* Image Viewer */}
              {isImage(resolveMimetype(archivo)) && fileUrl && (
                <div className="h-full flex items-center justify-center bg-gray-50 p-4">
                  <img
                    src={fileUrl}
                    alt={resolveName(archivo)}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              {/* Non-viewable files */}
              {!isViewableFile(resolveMimetype(archivo)) && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  {getFileIcon(resolveMimetype(archivo))}
                  <p className="text-lg font-medium mt-4 mb-2">
                    {resolveName(archivo)}
                  </p>
                  <p className="text-sm mb-4">
                    Este tipo de archivo no se puede visualizar en el navegador
                  </p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar para abrir
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {archivo?.description && (
                <p><strong>Descripción:</strong> {archivo.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVisualizarArchivo;