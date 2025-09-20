import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  CalendarDaysIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { periodoAcademicoService } from '../../services/periodoAcademicoService';

const ConfiguracionPeriodosDashboard = () => {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    activo: false
  });

  // Cargar períodos académicos
  useEffect(() => {
    loadPeriodos();
  }, []);

  const loadPeriodos = async () => {
    setLoading(true);
    try {
      const response = await periodoAcademicoService.getPeriodosAcademicos();
      if (response.success) {
        setPeriodos(response.data);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Error al cargar períodos académicos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingPeriodo) {
        response = await periodoAcademicoService.updatePeriodoAcademico(editingPeriodo.id, formData);
      } else {
        response = await periodoAcademicoService.createPeriodoAcademico(formData);
      }

      if (response.success) {
        toast.success(editingPeriodo ? 'Período actualizado exitosamente' : 'Período creado exitosamente');
        setShowModal(false);
        resetForm();
        loadPeriodos();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Error al guardar período académico');
    }
  };

  const handleEdit = (periodo) => {
    setEditingPeriodo(periodo);
    setFormData({
      nombre: periodo.nombre,
      descripcion: periodo.descripcion || '',
      fechaInicio: periodo.fechaInicio.split('T')[0],
      fechaFin: periodo.fechaFin.split('T')[0],
      activo: periodo.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este período académico?')) {
      try {
        const response = await periodoAcademicoService.deletePeriodoAcademico(id);
        if (response.success) {
          toast.success('Período eliminado exitosamente');
          loadPeriodos();
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        toast.error('Error al eliminar período académico');
      }
    }
  };

  const handleToggleActive = async (periodo) => {
    try {
      // Excluir el id del cuerpo de la petición
      const { id, ...periodoData } = periodo;
      const response = await periodoAcademicoService.updatePeriodoAcademico(periodo.id, {
        ...periodoData,
        activo: !periodo.activo
      });
      
      if (response.success) {
        toast.success(`Período ${!periodo.activo ? 'activado' : 'desactivado'} exitosamente`);
        loadPeriodos();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Error al cambiar estado del período');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      activo: false
    });
    setEditingPeriodo(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (activo) => {
    return activo ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="w-4 h-4 mr-1" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircleIcon className="w-4 h-4 mr-1" />
        Inactivo
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Cargando períodos académicos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración de Períodos Académicos</h1>
              <p className="text-gray-600">Gestiona los semestres y sus fechas de inicio y fin</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Período
          </button>
        </div>
      </div>

      {/* Períodos Académicos */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Períodos Académicos Configurados</h2>
          <p className="text-sm text-gray-600">Gestiona los períodos académicos para diferentes actividades</p>
        </div>

        {periodos.length === 0 ? (
          <div className="p-6 text-center">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay períodos académicos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo período académico.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {periodos.map((periodo) => (
                  <tr key={periodo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{periodo.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicio)}</div>
                        <div className="text-gray-500">hasta {formatDate(periodo.fechaFin)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(periodo.activo)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {periodo.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleActive(periodo)}
                          className={`p-2 rounded-lg transition-colors ${
                            periodo.activo 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={periodo.activo ? 'Desactivar' : 'Activar'}
                        >
                          {periodo.activo ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleEdit(periodo)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(periodo.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Eliminar"
                          disabled={periodo.activo}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPeriodo ? 'Editar Período Académico' : 'Nuevo Período Académico'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Período
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: 2025-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Descripción del período académico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                    Período activo
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                  >
                    {editingPeriodo ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionPeriodosDashboard;