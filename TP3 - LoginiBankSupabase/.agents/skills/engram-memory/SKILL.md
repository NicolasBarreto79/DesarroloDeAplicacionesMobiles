---
name: engram-memory
description: Comandos, consultas y protocolos para interactuar con el sistema de memoria persistente Engram en el proyecto iBank.
---

# Engram Memory Skill

Esta skill proporciona los comandos y directrices para interactuar con Engram en el proyecto `loginibanksupabase`.

## Proyecto Canónico
- **Project ID**: `loginibanksupabase`

## Consultas de Memoria

### Ver contexto general de la última sesión
```bash
engram context loginibanksupabase
```

### Buscar recuerdos por palabra clave (Full-Text Search FTS5)
```bash
engram search "<término>" --project loginibanksupabase
```

### Ver lista de proyectos registrados
```bash
engram projects list
```

## Guardado de Nuevos Recuerdos

### Formato estándar
```bash
engram save "<Título>" "**What**: <qué se hizo>`n**Why**: <por qué>`n**Where**: <rutas>`n**Learned**: <aprendizajes>" --type <architecture|bugfix|discovery|config|session_summary> --project loginibanksupabase --scope project
```

## Diagnóstico
```bash
engram doctor
```
