export interface PasswordRuleCheck {
  id: string
  label: string
  valid: boolean
}

export function validatePasswordRules(password: string): PasswordRuleCheck[] {
  const pwd = password || ''
  return [
    {
      id: 'min_length',
      label: 'Mínimo 8 caracteres',
      valid: pwd.length >= 8,
    },
    {
      id: 'has_uppercase',
      label: 'Al menos una mayúscula (A-Z)',
      valid: /[A-Z]/.test(pwd),
    },
    {
      id: 'has_lowercase',
      label: 'Al menos una minúscula (a-z)',
      valid: /[a-z]/.test(pwd),
    },
    {
      id: 'has_number',
      label: 'Al menos un número (0-9)',
      valid: /[0-9]/.test(pwd),
    },
    {
      id: 'has_symbol',
      label: 'Al menos un símbolo especial (!@#$%^&*)',
      valid: /[^A-Za-z0-9]/.test(pwd),
    },
  ]
}

export function isPasswordStrong(password: string): boolean {
  const checks = validatePasswordRules(password)
  return checks.every((c) => c.valid)
}
