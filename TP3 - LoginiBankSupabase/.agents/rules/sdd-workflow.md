# Flujo de Desarrollo Guiado por Especificaciones (Spec-Driven Development — SDD)

Este proyecto sigue el flujo de **Spec-Driven Development (SDD)** complementado con memoria persistente en Engram.

## Flujo Operativo Obligatorio

Para cada nueva tarea, cambio o característica, el agente debe seguir rigurosamente este ciclo:

```text
PEDIDO
  ↓
Consultar contexto / memoria de Engram
  ↓
Analizar el código existente
  ↓
Identificar archivos y componentes afectados
  ↓
Analizar posibles impactos y riesgos
  ↓
Crear especificación / plan detallado
  ↓
Esperar aprobación del usuario (cuando el cambio sea relevante)
  ↓
Implementar de forma incremental
  ↓
Ejecutar tests / verificaciones (npx tsc --noEmit, etc.)
  ↓
Revisar cambios (git status / git diff)
  ↓
Actualizar la memoria de Engram con decisiones y conocimientos relevantes
```

## Fases del SDD

### 1. Exploración y Memoria
- Antes de planear o codificar, buscar en Engram si existen antecedentes:
  `engram search "<tema>" --project loginibanksupabase`
- Inspeccionar el código fuente existente en `src/` para verificar interfaces, contratos y dependencias.

### 2. Especificación y Plan
- Todo cambio relevante debe contar con una especificación previa que detalle:
  - **Objetivo**: Qué problema se resuelve.
  - **Archivos a modificar / crear**: Rutas explícitas.
  - **Impacto y riesgos**: Posibles efectos colaterales en navegación, tokens de diseño o sesiones.
  - **Plan de verificación**: Cómo se comprobará que el cambio funciona (ej. chequeo de tipos TypeScript y prueba en Expo).
- Detenerse y solicitar confirmación al usuario antes de modificar archivos.

### 3. Implementación Controlada
- No modificar código que no haya sido aprobado en la especificación.
- Respetar la accesibilidad (touch targets >= 50px), los tokens oficiales de Figma en `theme.ts` y las convenciones de Expo SDK 57.
- No eliminar archivos sin justificación explícita y aprobación.

### 4. Verificación
- Ejecutar verificación estática: `npx tsc --noEmit`.
- Guiar la verificación visual o funcional en la app (Expo Go / emulador).

### 5. Cierre y Actualización de Memoria
- Al completar la tarea, registrar inmediatamente la decisión técnica, aprendizaje o cambio de arquitectura en Engram:
  `engram save "<Título>" "<Contenido>" --type <type> --project loginibanksupabase --scope project`
