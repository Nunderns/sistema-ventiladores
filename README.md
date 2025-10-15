# Projeto Avaliativo – Fábrica de Ventiladores

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

Substitua `OWNER/REPO` pelo caminho do repositório no GitHub.

## Monorepo
- Backend: `backend` (FastAPI, SQLAlchemy)
- Frontend: `frontend` (React + Vite + TypeScript)

## CI
- GitHub Actions (`.github/workflows/ci.yml`):
  - Backend: instala deps, verifica sintaxe, lint (ruff), formatação (black) e roda `pytest`.
  - Frontend: `npm ci`, `npm run lint` e `npm run build`.

## Pre-commit (Python)
1. Instale `pre-commit` (opcional localmente; no CI já roda):
   - `pip install pre-commit`
2. Ative os hooks:
   - `pre-commit install`
3. Rode manualmente em todos os arquivos:
   - `pre-commit run --all-files`

Hooks configurados em `.pre-commit-config.yaml`:
- `ruff --fix` (lint)
- `black` (formatação)
- Fixes básicos (EOF, trailing whitespace)

