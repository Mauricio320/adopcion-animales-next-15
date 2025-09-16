export enum TiposDocumentoEnum {
  CEDULA_CIUDADANIA = 1,
  CEDULA_EXTRANJERIA = 2,
  PASAPORTE = 3,
  PERMISO_PERMANENCIA = 4,
  NIT = 5,
}

export enum TiposUsuarioEnum {
  CIUDADANO = 1,
  ALBERGUE = 2,
}

export enum TiposPersonaEnum {
  NATURAL = 1,
  JURIDICA = 2,
}

export enum RolesEnum {
  USUARIO = "usuario",
  STAFF = "staff",
  RED_ANIMALIA = "red_animalia",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export const RolesLabels = {
  [RolesEnum.USUARIO]: "Usuario",
  [RolesEnum.STAFF]: "Staff (Albergue)",
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.SUPER_ADMIN]: "Super Administrador",
  [RolesEnum.RED_ANIMALIA]: "Red Animalia",
} as const;

export const ALL_ROLES = Object.values(RolesEnum);

export const requiereDigitoVerificacion = (
  tipoDocumentoId: number
): boolean => {
  return (
    tipoDocumentoId === TiposDocumentoEnum.CEDULA_CIUDADANIA ||
    tipoDocumentoId === TiposDocumentoEnum.NIT
  );
};
