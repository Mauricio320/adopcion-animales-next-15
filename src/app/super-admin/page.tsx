import RouteGuard from "@/components/auth/RouteGuard";
import { RolesEnum } from "@/types/enums/enums";

export default function SuperAdminPage() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.SUPER_ADMIN]}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ⚡ Panel de Super Administración
          </h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-yellow-700">
              Esta página solo es accesible para Super Administradores del
              sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold mb-4">
                Configuración del Sistema
              </h3>
              <p className="text-gray-600 mb-4">
                Configuraciones avanzadas y variables del sistema
              </p>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                Configurar Sistema
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <h3 className="text-lg font-semibold mb-4">Gestión de Roles</h3>
              <p className="text-gray-600 mb-4">
                Asignar y modificar roles de todos los usuarios
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Gestionar Roles
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold mb-4">Logs del Sistema</h3>
              <p className="text-gray-600 mb-4">
                Monitorear actividad y debugging del sistema
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Ver Logs
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold mb-4">Respaldo de Datos</h3>
              <p className="text-gray-600 mb-4">
                Gestionar respaldos y restauración de datos
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Gestionar Respaldos
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <h3 className="text-lg font-semibold mb-4">Métricas Avanzadas</h3>
              <p className="text-gray-600 mb-4">
                Estadísticas detalladas y análisis del sistema
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Ver Métricas
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
              <h3 className="text-lg font-semibold mb-4">Mantenimiento</h3>
              <p className="text-gray-600 mb-4">
                Herramientas de mantenimiento y optimización
              </p>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Herramientas
              </button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
