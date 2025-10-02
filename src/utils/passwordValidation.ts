export interface PasswordRequirement {
  text: string;
  check: () => boolean;
}

export const getPasswordRequirements = (
  password: string,
  confirmPassword: string,
  includeCurrentPassword: boolean = false,
  currentPassword: string = ""
): PasswordRequirement[] => {
  const requirements: PasswordRequirement[] = [];

  if (includeCurrentPassword) {
    requirements.push({
      text: "Contraseña actual requerida",
      check: () => currentPassword.trim() !== "",
    });
  }

  requirements.push(
    {
      text: "Confirmar contraseña coincide",
      check: () => password === confirmPassword && confirmPassword.trim() !== "",
    },
    { text: "Al menos 8 caracteres", check: () => password.length >= 8 },
    { text: "Una letra mayúscula", check: () => /[A-Z]/.test(password) },
    { text: "Una letra minúscula", check: () => /[a-z]/.test(password) },
    { text: "Un número", check: () => /\d/.test(password) },
    {
      text: "Un carácter especial",
      check: () => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }
  );

  return requirements;
};

export const validatePasswordStrength = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Al menos 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Una letra mayúscula");
  if (!/[a-z]/.test(password)) errors.push("Una letra minúscula");
  if (!/\d/.test(password)) errors.push("Un número");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push("Un carácter especial");
  return errors;
};

export const getPasswordStrengthErrors = (
  password: string,
  confirmPassword: string,
  currentPassword: string = "",
  includeCurrentPassword: boolean = false
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (includeCurrentPassword && !currentPassword.trim()) {
    newErrors.currentPassword = "Contraseña actual es requerida";
  }

  if (!password.trim()) {
    newErrors.password = "Contraseña es requerida";
  } else {
    const strengthErrors = validatePasswordStrength(password);
    if (strengthErrors.length > 0) {
      newErrors.password = `Contraseña débil: ${strengthErrors.join(", ")}`;
    }
  }

  if (!confirmPassword.trim()) {
    newErrors.confirmPassword = "Confirmación de contraseña es requerida";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Las contraseñas no coinciden";
  }

  return newErrors;
};

export const isPasswordFormValid = (
  password: string,
  confirmPassword: string,
  currentPassword: string = "",
  includeCurrentPassword: boolean = false
): boolean => {
  const hasPassword = password.trim().length > 0;
  const hasConfirmPassword = confirmPassword.trim().length > 0;
  const passwordsMatch = password === confirmPassword;
  const isStrongPassword = validatePasswordStrength(password).length === 0;
  const hasCurrentPassword = !includeCurrentPassword || currentPassword.trim().length > 0;

  return hasPassword && hasConfirmPassword && passwordsMatch && isStrongPassword && hasCurrentPassword;
};