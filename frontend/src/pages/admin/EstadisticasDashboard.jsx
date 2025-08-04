/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"

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
const ChartBar = ({ item, maxValue }) => (
  <div className="flex flex-col items-center flex-1 mx-2">
    <div 
      className={`${item.color} w-full max-w-16 rounded-t transition-all duration-500 hover:opacity-80`}
      style={{ height: `${(item.value / maxValue) * 100}%` }}
    ></div>
  </div>
);

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
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas</h1>
    
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
          { value: "Actividades Completadas", label: "Actividades Completadas" },
          { value: "Actividades Pendientes", label: "Actividades Pendientes" },
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
const BarChart = ({ chartData, maxValue }) => (
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
          <span className="text-sm text-gray-600">Actividades Completadas</span>
        </div>
      </div>
    </div>
  </Card>
);

// Componente de tabla de cumplimiento
const ComplianceTable = ({ complianceData, downloadFile }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cumplimiento</h2>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DOCENTE</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ACTIVIDADES COMPLETADAS</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ACTIVIDADES PENDIENTES</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">PORCENTAJE DE CUMPLIMIENTO</th>
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
    <div className="flex justify-end gap-3 mt-6">
      <DownloadButton format="PNG" onClick={() => downloadFile('PNG')} />
      <DownloadButton format="JPG" onClick={() => downloadFile('JPG')} />
      <DownloadButton format="SVG" onClick={() => downloadFile('SVG')} />
    </div>
  </Card>
);

// Datos estáticos
const chartData = [
  { name: "Dr. Juan Pérez", value: 15, color: "bg-green-500" },
  { name: "Dra. María González", value: 12, color: "bg-green-500" },
  { name: "Mtro. Carlos Rodríguez", value: 9, color: "bg-green-500" },
  { name: "Lic. Ana Martínez", value: 18, color: "bg-green-500" },
  { name: "Dr. Roberto Sánchez", value: 13, color: "bg-green-500" }
];

const complianceData = [
  { 
    docente: "Dr. Juan Pérez", 
    completadas: 15, 
    pendientes: 3, 
    porcentaje: 83,
    color: "bg-green-500"
  },
  { 
    docente: "Dra. María González", 
    completadas: 12, 
    pendientes: 5, 
    porcentaje: 71,
    color: "bg-green-500"
  },
  { 
    docente: "Mtro. Carlos Rodríguez", 
    completadas: 10, 
    pendientes: 2, 
    porcentaje: 83,
    color: "bg-green-500"
  },
  { 
    docente: "Lic. Ana Martínez", 
    completadas: 18, 
    pendientes: 1, 
    porcentaje: 95,
    color: "bg-green-500"
  },
  { 
    docente: "Dr. Roberto Sánchez", 
    completadas: 14, 
    pendientes: 4, 
    porcentaje: 78,
    color: "bg-green-500"
  }
];

// Componente principal
export default function EstadisticasDashboard() {
  const [selectedDate, setSelectedDate] = useState('fecha');
  const [selectedMetric, setSelectedMetric] = useState('Actividades Completadas');
  const [selectedChart, setSelectedChart] = useState('Grafico de Barras');

  const maxValue = Math.max(...chartData.map(item => item.value));

  const downloadFile = (format) => {
    console.log(`Descargando archivo en formato: ${format}`);
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
        
        <BarChart chartData={chartData} maxValue={maxValue} />
        
        <ComplianceTable complianceData={complianceData} downloadFile={downloadFile} />
      </div>
    </div>
  );
}