import RouteGuard from '@/components/auth/RouteGuard';
import { RolesEnum } from '@/types/enums/enums';

export default function AdminPage() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN]}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Panel de Administración
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Gestión de Usuarios</h3>
              <p className="text-gray-600 mb-4">
                Administra usuarios, roles y permisos del sistema
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Gestionar Usuarios
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Reportes del Sistema</h3>
              <p className="text-gray-600 mb-4">
                Ver estadísticas y reportes de adopciones
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Ver Reportes
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Configuración</h3>
              <p className="text-gray-600 mb-4">
                Configuración general del sistema
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
