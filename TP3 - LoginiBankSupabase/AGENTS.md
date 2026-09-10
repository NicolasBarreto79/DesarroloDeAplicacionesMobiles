# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# Flujo de Desarrollo (Gentle-AI + SDD + Engram)

Este proyecto está integrado con **Gentle-AI** y **Engram** para desarrollo asistido por IA ordenado y persistente.

## Identificador de Proyecto en Engram
- **Project ID**: `loginibanksupabase`

## Flujo Operativo Obligatorio (SDD)
Para cada pedido o modificación, seguir este ciclo:
1. **Consultar Memoria**: `engram search "<término>" --project loginibanksupabase` o `engram context loginibanksupabase`.
2. **Analizar Código e Impacto**: Revisar rutas, componentes y tokens afectados.
3. **Crear Especificación / Plan**: Definir qué se cambiará y cómo se verificará.
4. **Esperar Aprobación**: Aguardar confirmación del usuario si el cambio es importante.
5. **Implementar**: Realizar cambios de forma incremental respetando accesibilidad (touch targets >= 50px) y tokens Figma.
6. **Verificar**: Ejecutar validación de tipos (`npx tsc --noEmit`) y pruebas correspondientes.
7. **Actualizar Memoria**: Guardar decisiones clave con `engram save` (`--type architecture|bugfix|discovery|config`).

Para más detalles, consultar las reglas en [.agents/rules/](.agents/rules/) y skills en [.agents/skills/](.agents/skills/).

