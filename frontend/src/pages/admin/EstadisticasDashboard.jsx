/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState, useRef } from "react"
import { useStats } from "../../context/StatsContext"
import api from "../../services/api"
import { downloadNodeAsPng, downloadNodeAsSvg, downloadNodeAsJpeg, downloadSvgElement } from "../../utils/domCapture"

// Componentes reutilizables
const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div 
    className={`bg-white rounded-lg border border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Componente de selector personalizado
const Select = ({ label, value, onChange, options, className }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <select 
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Componente de barra del gráfico
const ChartBar = ({ item, maxValue }) => {
  const valueNum = Number(item?.value ?? 0);
  const safeMax = Number(maxValue ?? 0);
  const heightPercent = safeMax > 0 && valueNum > 0
    ? Math.round((valueNum / safeMax) * 100)
    : 0;

  // Asegurar que las barras sean visibles cuando hay valores pequeños
  const visiblePercent = heightPercent > 0 ? Math.max(heightPercent, 5) : 0;

  return (
    <div className="flex flex-col justify-end items-center flex-1 mx-2 h-full">
      <div 
        className={`${item.color} w-full max-w-16 rounded-t transition-all duration-500 hover:opacity-80`}
        style={{ height: `${visiblePercent}%`, minHeight: valueNum > 0 ? '6px' : 0 }}
      ></div>
    </div>
  );
};

// Componente de fila de tabla de cumplimiento
const ComplianceTableRow = ({ item }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-4 px-4 text-sm text-gray-900">{item.docente}</td>
    <td className="py-4 px-4 text-sm text-gray-900 font-medium">{item.completadas}</td>
    <td className="py-4 px-4 text-sm text-gray-900">{item.pendientes}</td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
          <div 
            className={`${item.color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${item.porcentaje}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-900">{item.porcentaje}%</span>
      </div>
    </td>
  </tr>
);

// Componente de botón de descarga
const DownloadButton = ({ format, onClick }) => (
  <Button 
    data-no-export="true"
    onClick={onClick}
    className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Descargar {format}
  </Button>
);

// Componente de encabezado con filtros
const DashboardHeader = ({ selectedDate, setSelectedDate, selectedMetric, setSelectedMetric, selectedChart, setSelectedChart }) => (
  <Card className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas de Reportes</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Select
        label="Rango de fechas"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        options={[
          { value: "fecha", label: "📅 Seleccionar fecha" },
          { value: "semana", label: "Esta semana" },
          { value: "mes", label: "Este mes" },
          { value: "trimestre", label: "Este trimestre" }
        ]}
      />
      
      <Select
        label="Tipo de métrica"
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
        options={[
          { value: "Reportes Aprobados", label: "Reportes Aprobados" },
          { value: "Reportes Pendientes", label: "Reportes Pendientes" },
          { value: "Porcentaje Cumplimiento", label: "Porcentaje Cumplimiento" }
        ]}
      />
      
      <Select
        label="Tipo de gráfico"
        value={selectedChart}
        onChange={(e) => setSelectedChart(e.target.value)}
        options={[
          { value: "Grafico de Barras", label: "Gráfico de Barras" },
          { value: "Grafico de Lineas", label: "Gráfico de Líneas" },
          { value: "Grafico Circular", label: "Gráfico Circular" }
        ]}
      />
    </div>
  </Card>
);

// Componente de gráfico de barras
const BarChart = ({ chartData, maxValue, legendLabel = "Reportes Aprobados" }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Rendimiento de Docentes</h2>
    
    <div className="space-y-6">
      {/* Y-axis labels and chart */}
      <div className="flex">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-80 w-8 text-xs text-gray-600 mr-4">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>
        
        {/* Chart bars */}
        <div className="flex-1 flex items-end justify-between h-80 border-l border-b border-gray-300 px-4">
          {chartData.map((item, index) => (
            <ChartBar key={index} item={item} maxValue={maxValue} />
          ))}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex ml-12">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 mx-2 text-xs text-center text-gray-600">
            <div className="break-words">{item.name}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">{legendLabel}</span>
        </div>
      </div>
    </div>
  </Card>
);

// Componente de gráfico de líneas simple (SVG)
const LineChart = ({ chartData, maxValue, legendLabel = "Reportes Aprobados" }) => {
  const width = 800;
  const height = 320;
  const paddingLeft = 40;
  const paddingBottom = 30;

  const points = chartData.map((item, idx) => {
    const x = paddingLeft + (idx * (width - paddingLeft) / Math.max(chartData.length - 1, 1));
    const valueNum = Number(item?.value ?? 0);
    const yRatio = maxValue > 0 ? (valueNum / maxValue) : 0;
    const y = (height - paddingBottom) - yRatio * (height - paddingBottom - 10);
    return { x, y, name: item.name, color: item.color };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Rendimiento de Docentes</h2>
      <div className="space-y-4">
        <div className="border rounded">
          <svg width={width} height={height} className="w-full h-80">
            {/* Ejes simples */}
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width} y2={height - paddingBottom} stroke="#D1D5DB" />
            <line x1={paddingLeft} y1={10} x2={paddingLeft} y2={height - paddingBottom} stroke="#D1D5DB" />
            {/* Línea */}
            <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2" />
            {/* Puntos */}
            {points.map((p, idx) => (
              <circle key={idx} cx={p.x} cy={p.y} r={4} fill="#10B981" />
            ))}
          </svg>
        </div>

        {/* Etiquetas X */}
        <div className="flex ml-10">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 mx-2 text-xs text-center text-gray-600">
              <div className="break-words">{item.name}</div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">{legendLabel}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Componente de gráfico circular simple (conic-gradient)
const PieChart = ({ chartData, legendLabel = "Reportes Aprobados" }) => {
  const total = chartData.reduce((sum, item) => sum + Number(item?.value ?? 0), 0);
  let current = 0;
  const slices = chartData.map((item) => {
    const value = Number(item?.value ?? 0);
    const start = current / Math.max(total, 1) * 360;
    const end = (current + value) / Math.max(total, 1) * 360;
    current += value;
    return { start, end, color: item.color, name: item.name, value };
  });

  const gradient = slices.map(s => `${s.color.replace('bg-', '')} ${s.start}deg ${s.end}deg`).join(', ');

  // Mapeo básico de clases tailwind a colores hex para conic-gradient
  const colorMap = {
    'green-500': '#10B981',
    'yellow-500': '#F59E0B',
    'red-500': '#EF4444',
    'blue-500': '#3B82F6',
    'purple-500': '#8B5CF6'
  };
  const gradientCss = slices.map(s => `${colorMap[s.color.replace('bg-', '')] || '#10B981'} ${s.start}deg ${s.end}deg`).join(', ');

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Rendimiento de Docentes</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-64 h-64 rounded-full" style={{ backgroundImage: `conic-gradient(${gradientCss})` }} />
        <div className="space-y-2">
          <div className="text-sm text-gray-600 mb-2">{legendLabel} (distribución)</div>
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-800">
              <span className={`inline-block w-3 h-3 rounded ${item.color}`}></span>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500">— {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Componente de tabla de cumplimiento
const ComplianceTable = ({ complianceData, downloadFile }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cumplimiento de Reportes</h2>
    
    {/* Contador de docentes */}
    <div className="mb-4 text-sm text-gray-600">
      Mostrando <strong>{complianceData.length}</strong> docente(s)
    </div>
    
    {/* Tabla con scroll vertical para muchos docentes */}
    <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="w-full">
        <thead className="sticky top-0 bg-white shadow-sm">
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 bg-gray-50">DOCENTE</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 bg-gray-50">REPORTES APROBADOS</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 bg-gray-50">REPORTES PENDIENTES</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 bg-gray-50">PORCENTAJE DE CUMPLIMIENTO</th>
          </tr>
        </thead>
        <tbody>
          {complianceData.map((item, index) => (
            <ComplianceTableRow key={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>

    {/* Download buttons */}
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
      <DownloadButton format="PNG" onClick={() => downloadFile('PNG')} />
      <DownloadButton format="JPG" onClick={() => downloadFile('JPG')} />
      <DownloadButton format="SVG" onClick={() => downloadFile('SVG')} />
    </div>
  </Card>
);

// Helpers
const getComplianceColor = (pct) => {
  if (pct >= 70) return "bg-green-500";
  if (pct >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

// Componente principal
export default function EstadisticasDashboard() {
  const [selectedDate, setSelectedDate] = useState('fecha');
  const [selectedMetric, setSelectedMetric] = useState('Reportes Aprobados');
  const [selectedChart, setSelectedChart] = useState('Grafico de Barras');
  const [complianceData, setComplianceData] = useState([]);
  const [loadingCompliance, setLoadingCompliance] = useState(false);
  const [errorCompliance, setErrorCompliance] = useState(null);
  const chartRef = useRef(null);
  const tableRef = useRef(null);

  // Stats generales del dashboard (reportes)
  const { stats, loading: loadingStats, error: errorStats, fetchStats } = useStats();

  useEffect(() => {
    // Cargar stats del dashboard si no existen
    if (!stats) {
      fetchStats();
    }
  }, [stats, fetchStats]);

  // Log de stats cuando cambian
  useEffect(() => {
    if (stats) {
      console.log('📊 [EstadisticasDashboard] Stats desde contexto:', stats);
      console.log('📊 [EstadisticasDashboard] Valores para gráfico:', {
        completadas: stats.completadas,
        pendientes: stats.pendientes,
        devueltas: stats.devueltas,
        total: stats.total,
      });
    }
  }, [stats]);

  // Construir data del gráfico desde stats
  const chartData = useMemo(() => {
    // Si tenemos cumplimiento por docente, construimos el gráfico por docente según la métrica seleccionada
    if (complianceData && complianceData.length > 0) {
      const colorForMetric = selectedMetric === 'Porcentaje Cumplimiento'
        ? 'bg-blue-500'
        : selectedMetric === 'Reportes Pendientes'
          ? 'bg-yellow-500'
          : 'bg-green-500';
      return complianceData.map((row) => ({
        name: row.docente,
        value: selectedMetric === 'Porcentaje Cumplimiento' ? row.porcentaje : (selectedMetric === 'Reportes Pendientes' ? row.pendientes : row.completadas),
        color: colorForMetric
      }));
    }
    // Fallback a estadísticas generales por estado de reportes
    if (!stats) return [];
    return [
      { name: "Aprobados", value: stats.completadas || 0, color: "bg-green-500" },
      { name: "Pendientes", value: stats.pendientes || 0, color: "bg-yellow-500" },
      { name: "Devueltos", value: stats.devueltas || 0, color: "bg-red-500" }
    ];
  }, [stats, complianceData, selectedMetric]);

  const maxValue = useMemo(() => {
    return chartData.length ? Math.max(...chartData.map(item => Number(item.value ?? 0))) : 0;
  }, [chartData]);

  // Cargar cumplimiento por docente usando estadísticas de reportes por usuario
  useEffect(() => {
    const loadCompliance = async () => {
      setLoadingCompliance(true);
      setErrorCompliance(null);
      try {
        // 1) Obtener roles y localizar IDs de DOCENTE y COORDINADOR (case-insensitive)
        const rolesRes = await api.get('/roles');
        const roles = rolesRes.data?.data || [];
        console.log('🧩 [EstadisticasDashboard] /roles response.data:', rolesRes.data);
        console.log('🧩 [EstadisticasDashboard] Roles encontrados:', roles.length);
        const docenteRole = roles.find(r => String(r?.nombre || '').toUpperCase() === 'DOCENTE');
        const coordinadorRole = roles.find(r => String(r?.nombre || '').toUpperCase() === 'COORDINADOR');
        const roleIds = [];
        if (docenteRole?.id) roleIds.push(docenteRole.id);
        if (!docenteRole?.id) console.warn('⚠️ [EstadisticasDashboard] Rol DOCENTE no encontrado por nombre, se intentará incluir COORDINADOR');
        if (coordinadorRole?.id) roleIds.push(coordinadorRole.id);
        if (roleIds.length === 0) throw new Error('No se encontraron roles DOCENTE/COORDINADOR');

        // 2) Obtener docentes activos para los roles identificados y combinar sin duplicados
        const docentesList = [];
        for (const roleId of roleIds) {
          const docentesRes = await api.get(`/users/by-role/${roleId}`, { params: { activo: true } });
          const arr = docentesRes.data?.data || [];
          console.log(`👩‍🏫 [EstadisticasDashboard] /users/by-role/${roleId} response.data:`, docentesRes.data);
          console.log(`👩‍🏫 [EstadisticasDashboard] Usuarios activos para rol ${roleId}:`, arr.length);
          docentesList.push(...arr);
        }
        // Unificar y eliminar duplicados por id
        const seen = new Set();
        const docentes = docentesList.filter(d => {
          const id = d?.id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        console.log('👩‍🏫 [EstadisticasDashboard] Docentes combinados únicos:', docentes.map(d => d.id));

        // Mostrar TODOS los docentes (sin límite)
        console.log('👥 [EstadisticasDashboard] Total de docentes a mostrar:', docentes.length);

        // 3) Para cada docente, obtener estadísticas de reportes
        const rows = [];
        for (const docente of docentes) {
          const nombreCompleto = `${docente.nombre} ${docente.apellido}`.trim();
          const statsRes = await api.get('/reportes/stats/general', { params: { usuarioId: docente.id } });
          const s = statsRes.data?.data || {};
          console.log(`📈 [EstadisticasDashboard] Stats de reportes para docente ${docente.id}:`, statsRes.data);
          const completadas = s.completados || 0;
          const pendientes = (s.pendientes || 0) + (s.enRevision || 0) + (s.devueltos || 0);
          const porcentaje = s.porcentajes?.completados ?? (s.total > 0 ? Math.round((completadas / s.total) * 100) : 0);
          const row = {
            docente: nombreCompleto || docente.email || `Usuario ${docente.id}`,
            completadas,
            pendientes,
            porcentaje,
            color: getComplianceColor(porcentaje)
          };
          console.log('➡️ [EstadisticasDashboard] Row calculada:', row);
          rows.push(row);
        }

        // Ordenar por porcentaje de cumplimiento descendente
        rows.sort((a, b) => b.porcentaje - a.porcentaje);
        setComplianceData(rows);
        console.log('✅ [EstadisticasDashboard] Cumplimiento por docente (rows):', rows);
      } catch (err) {
        console.error('❌ [EstadisticasDashboard] Error cargando cumplimiento por docente:', err);
        setErrorCompliance(err?.response?.data?.message || err?.message || 'Error al cargar cumplimiento por docente');
      } finally {
        setLoadingCompliance(false);
      }
    };

    loadCompliance();
  }, []);

  const downloadChart = async (format) => {
    const node = chartRef.current;
    if (!node) return;
    const filename = `grafico-${String(selectedChart).replace(/\s+/g, '-').toLowerCase()}`;
    try {
      if (format === 'PNG') {
        await downloadNodeAsPng(node, `${filename}.png`);
      } else if (format === 'SVG') {
        const svgEl = node.querySelector('svg');
        if (svgEl) {
          await downloadSvgElement(svgEl, `${filename}.svg`);
        } else {
          await downloadNodeAsSvg(node, `${filename}.svg`);
        }
      } else if (format === 'JPG') {
        await downloadNodeAsJpeg(node, `${filename}.jpg`);
      }
    } catch (err) {
      console.error('❌ Error al descargar gráfico:', err);
    }
  };

  const downloadFile = async (format) => {
    const node = tableRef.current;
    if (!node) return;
    const filename = 'tabla-cumplimiento';
    try {
      if (format === 'PNG') {
        await downloadNodeAsPng(node, `${filename}.png`);
      } else if (format === 'SVG') {
        await downloadNodeAsSvg(node, `${filename}.svg`);
      } else if (format === 'JPG') {
        await downloadNodeAsJpeg(node, `${filename}.jpg`);
      }
    } catch (err) {
      console.error('❌ Error al descargar tabla:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
        {/* Gráfico dinámico (actividades) */}
        {loadingStats ? (
          <Card className="p-6">
            <div className="animate-pulse h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-80 bg-gray-100 rounded" />
          </Card>
        ) : errorStats ? (
          <Card className="p-6">
            <p className="text-red-600">{errorStats}</p>
          </Card>
        ) : (
          <>
            <div ref={chartRef}>
              {selectedChart === 'Grafico de Barras' ? (
                <BarChart chartData={chartData} maxValue={maxValue} legendLabel={selectedMetric} />
              ) : selectedChart === 'Grafico de Lineas' ? (
                <LineChart chartData={chartData} maxValue={maxValue} legendLabel={selectedMetric} />
              ) : (
                <PieChart chartData={chartData} legendLabel={selectedMetric} />
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <DownloadButton format="PNG" onClick={() => downloadChart('PNG')} />
              <DownloadButton format="SVG" onClick={() => downloadChart('SVG')} />
            </div>
          </>
        )}

        {/* Tabla dinámica (cumplimiento por docente basado en reportes) */}
        {loadingCompliance ? (
          <Card className="p-6">
            <div className="animate-pulse h-6 w-64 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded" />
              ))}
            </div>
          </Card>
        ) : errorCompliance ? (
          <Card className="p-6">
            <p className="text-red-600">{errorCompliance}</p>
          </Card>
        ) : (
          complianceData.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-600">No hay datos de cumplimiento para mostrar.</p>
            </Card>
          ) : (
            <div ref={tableRef}>
              <ComplianceTable complianceData={complianceData} downloadFile={downloadFile} />
            </div>
          )
        )}
      </div>
    </div>
  );
}