export enum EstadoAnimalEnum {
  ADOPTADO = 1,
  APADRINADO = 2,
}

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
  RED_ANIMALIA = 3,
  VETERINARIA = 4,
}

export const TiposUsuarioLabels = {
  [TiposUsuarioEnum.CIUDADANO]: "Ciudadano",
  [TiposUsuarioEnum.ALBERGUE]: "Albergue",
  [TiposUsuarioEnum.RED_ANIMALIA]: "Red Animalia",
  [TiposUsuarioEnum.VETERINARIA]: "Veterinaria",
} as const;

export enum TiposPersonaEnum {
  NATURAL = 1,
  JURIDICA = 2,
}

export enum RolesEnum {
  USUARIO = "usuario",
  STAFF = "staff",
  RED_ANIMALIA = "red_animalia",
  ADMIN = "admin",
  VETERINARIA = "veterinaria",
  SUPER_ADMIN = "super_admin",
}

export const RolesForTipoUsuario = {
  [TiposUsuarioEnum.CIUDADANO]: RolesEnum.USUARIO,
  [TiposUsuarioEnum.ALBERGUE]: RolesEnum.STAFF,
  [TiposUsuarioEnum.RED_ANIMALIA]: RolesEnum.RED_ANIMALIA,
  [TiposUsuarioEnum.VETERINARIA]: RolesEnum.VETERINARIA,
} as const;

export const RolesLabels = {
  [RolesEnum.USUARIO]: "Usuario",
  [RolesEnum.STAFF]: "Staff (Albergue)",
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.VETERINARIA]: "Staff (Veterinaria)",
  [RolesEnum.RED_ANIMALIA]: "Red Animalia",
  [RolesEnum.SUPER_ADMIN]: "Super Administrador",
} as const;

export const TitleLabels = {
  [RolesEnum.USUARIO]: "Usuario",
  [RolesEnum.STAFF]: "Albergue",
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.VETERINARIA]: "Veterinaria",
  [RolesEnum.RED_ANIMALIA]: "Red Animalia",
  [RolesEnum.SUPER_ADMIN]: "Super Administrador",
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
