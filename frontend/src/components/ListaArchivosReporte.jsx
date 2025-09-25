import React, { useState } from 'react';
import { FileText, Image, File, Download, Eye, Paperclip } from 'lucide-react';
import ModalVisualizarArchivo from './ModalVisualizarArchivo';
import archivoService from '../services/archivoService';
import { toast } from 'react-toastify';

const ListaArchivosReporte = ({ archivos = [], titulo = "Archivos adjuntos" }) => {
  const [modalArchivo, setModalArchivo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (mimetype?.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimetype?.includes('word')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (mimetype?.includes('excel') || mimetype?.includes('spreadsheet')) return <FileText className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const isViewableFile = (mimetype) => {
    return mimetype?.includes('pdf') || mimetype?.includes('image');
  };

  const handleViewFile = (archivo) => {
    setModalArchivo(archivo);
    setShowModal(true);
    toast.success(`Abriendo "${archivo.nombre_original || archivo.filename}"`, {
      position: "top-right",
      autoClose: 2000,
      icon: '👁️'
    });
  };

  const handleDownloadFile = async (archivo) => {
    try {


      // Toast de inicio de descarga
      const downloadToastId = toast.loading(`Descargando "${archivo.nombre_original || archivo.filename}"...`, {
        position: "top-right",
      });

      const blob = await archivoService.downloadArchivo(archivo.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = archivo.nombre_original || archivo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.dismiss(downloadToastId);
      toast.success(`¡Descarga completada! "${archivo.nombre_original || archivo.filename}"`, {
        position: "top-right",
        autoClose: 3000,
        icon: '⬇️'
      });
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      toast.error(`Error al descargar "${archivo.nombre_original || archivo.filename}": ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        icon: '❌'
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    return archivoService.formatFileSize(bytes);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalArchivo(null);
  };

  if (!archivos || archivos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No hay archivos adjuntos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <Paperclip className="w-4 h-4" />
        {titulo} ({archivos.length})
      </h4>
      
      <div className="space-y-2">
        {archivos.map((archivo, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(archivo.tipo_mime)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {archivo.nombre_original || archivo.filename}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{archivo.tipo_mime || 'Tipo desconocido'}</span>
                  {archivo.tamaño && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(archivo.tamaño)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {isViewableFile(archivo.tipo_mime) && (
                <button
                  onClick={() => handleViewFile(archivo)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Ver archivo"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              )}
              
              <button
                onClick={() => handleDownloadFile(archivo)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Descargar archivo"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para visualizar archivos */}
      <ModalVisualizarArchivo
        isOpen={showModal}
        onClose={closeModal}
        archivo={modalArchivo}
      />
    </div>
  );
};

export default ListaArchivosReporte;