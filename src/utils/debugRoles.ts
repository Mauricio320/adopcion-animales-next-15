import { supabase } from "@/lib/supabase/client";

/**
 * 🧪 FUNCIÓN DE TESTING PARA DEBUGGING DE ROLES
 * Esta función nos ayudará a probar la asignación de roles
 */
export const testRoleAssignment = async (tipoUsuarioId: number, email: string) => {
  console.log('🧪 === INICIO TEST ROLE ASSIGNMENT ===');
  
  // Debug 1: Verificar enum
  const TiposUsuarioEnum = {
    CIUDADANO: 1,
    ALBERGUE: 2
  };
  
  console.log('📊 Enums disponibles:', TiposUsuarioEnum);
  console.log('📝 tipo_usuario_id recibido:', tipoUsuarioId);
  console.log('📧 email:', email);
  
  // Debug 2: Verificar comparación
  const esAlbergue = Number(tipoUsuarioId) === TiposUsuarioEnum.ALBERGUE;
  console.log('🔍 Comparación:');
  console.log('  Number(tipoUsuarioId):', Number(tipoUsuarioId));
  console.log('  TiposUsuarioEnum.ALBERGUE:', TiposUsuarioEnum.ALBERGUE);
  console.log('  Son iguales?:', Number(tipoUsuarioId) === TiposUsuarioEnum.ALBERGUE);
  console.log('  esAlbergue resultado:', esAlbergue);
  
  // Debug 3: Asignar rol
  const rolAsignado = esAlbergue ? 'staff' : 'usuario';
  console.log('🎯 Rol que se asignaría:', rolAsignado);
  
  // Debug 4: Crear objeto usuario de prueba
  const usuarioTest = {
    nombre: 'Test Usuario',
    apellidos: 'Test Apellidos',
    correo: email,
    numero_documento: '123456789',
    tipo_usuario_id: tipoUsuarioId,
    rol: rolAsignado,
    estado: 'activo',
    email_confirmed: false
  };
  
  console.log('👤 Usuario de prueba que se insertaría:');
  console.log(usuarioTest);
  
  // Debug 5: Verificar si campo 'rol' existe en la tabla
  try {
    const { data: testInsert, error: testError } = await supabase
      .from('usuarios')
      .insert([usuarioTest])
      .select()
      .single();
    
    if (testError) {
      console.error('❌ Error al insertar usuario de prueba:', testError);
      
      // Si es error de columna que no existe
      if (testError.message.includes('column "rol" of relation "usuarios" does not exist')) {
        console.log('🚨 PROBLEMA ENCONTRADO: La columna "rol" NO existe en la tabla usuarios');
        console.log('💡 SOLUCIÓN: Ejecuta la migración SQL para agregar la columna "rol"');
      }
    } else {
      console.log('✅ Usuario de prueba insertado correctamente:');
      console.log(testInsert);
      
      // Limpiar el usuario de prueba
      const { error: deleteError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', testInsert.id);
      
      if (!deleteError) {
        console.log('🧹 Usuario de prueba eliminado correctamente');
      }
    }
  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
  }
  
  console.log('🧪 === FIN TEST ROLE ASSIGNMENT ===');
  
  return {
    tipoUsuarioId,
    esAlbergue,
    rolAsignado,
    usuarioTest
  };
};

/**
 * 🔧 FUNCIÓN PARA VERIFICAR ESTRUCTURA DE TABLA
 */
export const verifyTableStructure = async () => {
  console.log('🔍 === VERIFICANDO ESTRUCTURA DE TABLA ===');
  
  try {
    // Intentar obtener un usuario existente para ver qué campos tiene
    const { data: sample, error } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('❌ Error al obtener muestra:', error);
    } else if (sample) {
      console.log('📋 Campos disponibles en la tabla usuarios:');
      console.log(Object.keys(sample));
      
      if ('rol' in sample) {
        console.log('✅ Campo "rol" existe en la tabla');
        console.log('📄 Valor actual del campo rol:', sample.rol);
      } else {
        console.log('❌ Campo "rol" NO existe en la tabla');
        console.log('💡 Necesitas ejecutar la migración SQL');
      }
    }
  } catch (error) {
    console.error('💥 Error verificando estructura:', error);
  }
  
  console.log('🔍 === FIN VERIFICACIÓN ===');
};
