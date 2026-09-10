---
name: sdd-workflow
description: Flujo de Spec-Driven Development (SDD) para planificar, revisar, implementar y verificar cambios en el proyecto iBank.
---

# Spec-Driven Development (SDD) Skill

Esta skill define el procedimiento paso a paso para ejecutar tareas de desarrollo guiadas por especificaciones:

## Fases del Ciclo SDD

### 1. Consultar Memoria
Siempre iniciar recuperando contexto con `engram context loginibanksupabase` o `engram search "<término>" --project loginibanksupabase`.

### 2. Análisis de Código e Impacto
- Identificar componentes en `src/app/`, `src/components/`, `src/lib/`, `src/constants/`.
- Evaluar dependencias y compatibilidad con Expo SDK 57.

### 3. Especificación / Plan (Spec)
Redactar una especificación concisa:
- **Objetivo y justificación**
- **Archivos a modificar / crear**
- **Tokens y accesibilidad** (respetar Figma iBank y WCAG >= 50px)
- **Estrategia de verificación**

### 4. Aprobación
Presentar el plan al usuario y aguardar confirmación explícita si el cambio es sustancial.

### 5. Implementación
Escribir el código estrictamente según la especificación acordada.

### 6. Verificación
- Comprobar que no haya errores de TypeScript: `npx tsc --noEmit`.
- Verificar compatibilidad de rutas y estilos.

### 7. Registro de Memoria en Engram
Documentar la decisión técnica o resultado en Engram usando `engram save` con `--project loginibanksupabase`.
