# Protocolo de Memoria Persistente con Engram

Este proyecto utiliza **Engram** como sistema de memoria persistente para retener decisiones arquitectónicas, convenciones y aprendizajes entre diferentes sesiones de desarrollo.

## Identificador de Proyecto
- Proyecto en Engram: `loginibanksupabase`
- Cuando se ejecuten comandos CLI de Engram, especificar siempre `--project loginibanksupabase`.

## 1. Al inicio de cada sesión o pedido
1. Consultar el contexto previo con `mem_context` o mediante terminal:
   ```bash
   engram context loginibanksupabase
   ```
2. Si el pedido involucra un tema específico (ej. auth, supabase, persistencia, deep linking, ui), realizar una búsqueda proactiva:
   ```bash
   engram search "<término>" --project loginibanksupabase
   ```
3. No asumir decisiones previas ni preguntar al usuario cosas que ya estén registradas en Engram.

## 2. Cuándo guardar recuerdos (Mandatorio)
Guardar una memoria inmediatamente después de:
- Decisión de arquitectura o diseño tomada.
- Corrección de un bug relevante o no evidente.
- Hallazgo técnico clave o restricción del framework/SDK.
- Cambio o agregado de configuración importante.
- Nueva convención o regla de negocio implementada.

## 3. Formato estándar para `mem_save` / `engram save`
- **Título**: Verbo + objeto conciso (ej. "Configurado guard de recuperación vencida").
- **Tipo**: `architecture` | `bugfix` | `discovery` | `config` | `session_summary`.
- **Scope**: `project`
- **Estructura del contenido**:
  - **What**: Qué se realizó o decidió (una oración clara).
  - **Why**: Motivación, regla de negocio o requerimiento.
  - **Where**: Archivos o rutas involucradas.
  - **Learned**: Detalles técnicos, restricciones o advertencias para el futuro.

## 4. Prevención de Duplicados
- **Buscar antes de guardar**: Realizar un `search` previo para verificar si ya existe un recuerdo sobre el tema.
- **Topic Keys**: Usar `topic_key` estable (ej. `architecture/session-storage`) para actualizar el registro existente (upsert) en vez de generar observaciones contradictorias.

## 5. Qué NO guardar
- Transcripciones de chat completas ni salidas crudas de terminal.
- Claves secretas, credenciales o contenidos de `.env`.
- Archivos de código enteros (guardar resumen y referencia al path).
- Datos efímeros de debugging temporal.
