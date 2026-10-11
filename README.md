# CYBER-SYN: Protocolo Homeostasis
### Simulador Estratégico de Dinámica Cibernética y Teoría General de Sistemas (TGS)
**Torneo de Sistemas | Parcial Segundo Corte | Ingeniería de Sistemas**

![Netlify Deploy Ready](https://img.shields.io/badge/Netlify-Ready-00ad9f?style=for-the-badge&logo=netlify)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-12.8-F69220?style=for-the-badge&logo=pnpm)

---

## 🌌 1. Resumen Ejecutivo del Proyecto
**CYBER-SYN: Protocolo Homeostasis** es un juego web de simulación estratégica sistémica diseñado bajo las especificaciones oficiales de la **Guía del Estudiante - Torneo de Sistemas (TGS)**.

El jugador o equipo asume el control de la **Unidad de Regulación Cibernética** de la *Biópolis Orbital Kepler-42*, un macro-sistema abierto, dinámico y termodinámicamente no lineal. El objetivo teleológico es mantener el equilibrio homeostático y la viabilidad estructural de la estación durante 15 ciclos operativos (15 minutos de torneo), enfrentando perturbaciones estocásticas del entorno cósmico mediante la modulación de bucles de retroalimentación, la inyección de negentropía y el cumplimiento estricto de la **Ley de Variedad Requerida de Ashby**.

---

## 🎯 2. Cumplimiento de la Regla de Oro
> *"El objetivo no es diseñar simplemente un juego sobre TGS; el objetivo es diseñar un juego que haga pensar sistémicamente."*

El simulador demuestra matemáticamente por qué el **pensamiento lineal** fracasa en sistemas complejos:
1. **Retardos Temporales (Delays):** Las acciones sobre los servomecanismos tardan ciclos en manifestarse. Quien actúa con impaciencia y sobre-corrige provoca resonancia armónica y destrucción del sistema.
2. **Efectos Secundarios No Lineales:** Aumentar bruscamente la generación de energía soluciona el déficit temporal, pero genera calor que dispara la entropía informacional y ciega los sensores en los turnos posteriores.
3. **Puntos de Apalancamiento (Donella Meadows):** Para ganar, el jugador no debe atacar síntomas aislados, sino calibrar la regla de amortiguamiento del bucle equilibrador (B1) y expandir la variedad del controlador.

---

## 📚 3. Temas del Segundo Corte Integrados
El juego supera el requisito mínimo de 2 temas al integrar 4 dimensiones teóricas:
* **Cibernética (OBLIGATORIO):** Servomecanismos cerrados (Sensor $\rightarrow$ Comparador $\rightarrow$ Actuador), Bucles Equilibradores (Balancing Loops B1, B2), Bucles Reforzadores Desestabilizadores (Reinforcing Loops R1) y la **Ley de Variedad Requerida de W. Ross Ashby** ($V_c \ge V_e$).
* **Entropía en la Información (Claude Shannon):** Pérdida de certidumbre en las lecturas diagnósticas por ruido blanco electromagnético en los canales ($H = -\sum p \log_2 p$), y la necesidad de inyectar **Negentropía** (Schrödinger/Brillouin) para restaurar el orden.
* **Teoría de la Decisión (Herbert Simon):** Racionalidad acotada bajo incertidumbre y análisis de trade-offs de segundo orden.
* **TGS en Sistemas Complejos y Organizacionales:** Principios de viabilidad (Stafford Beer - VSM) y arquetipos sistémicos.

---

## 📦 4. Entregables Oficiales en este Repositorio

| Entregable | Archivo en el Repositorio | Descripción |
| :--- | :--- | :--- |
| **Juego Web Totalmente Funcional** | `src/`, `index.html`, `dist/` | Simulador interactivo en tiempo real con CLD dinámico, osciloscopio y audio procedural. |
| **Ficha Técnica Oficial (.md y .pdf)** | [`FICHA_TECNICA.md`](./FICHA_TECNICA.md) / [`ficha_tecnica.pdf`](./ficha_tecnica.pdf) | Cumple al 100% la tabla del numeral 6 de la guía oficial. |
| **Manual de Reglas y Guía** | [`MANUAL_DE_REGLAS.md`](./MANUAL_DE_REGLAS.md) | Reglas detalladas, fases de turno, catálogo de políticas y estrategia sistémica. |
| **Presentación de 5 Diapositivas** | [`PRESENTACION_5_DIAPOSITIVAS.md`](./PRESENTACION_5_DIAPOSITIVAS.md) | Contenido exacto, guion del expositor (speech) y banco de respuestas para el docente. |
| **Configuración de Netlify** | [`netlify.toml`](./netlify.toml) | Configuración directa para despliegue estático continuo. |

---

## 🚀 5. Instalación y Ejecución Local

### Prerrequisitos:
* **Node.js** (v18+)
* **pnpm** (o npm)
* **Python** (opcional, para compilar el PDF de la ficha técnica)

### Pasos:
```bash
# 1. Instalar dependencias con pnpm
pnpm install

# 2. Iniciar servidor de desarrollo local
pnpm run dev

# 3. Compilar para producción (Netlify)
pnpm run build

# 4. Probar la compilación en local
pnpm run preview

# 5. Generar o regenerar el PDF oficial de la Ficha Técnica
pnpm run pdf
# o alternativamente:
python scripts/generate_pdf.py
```

---

## 🌐 6. Despliegue en Netlify
El proyecto incluye `netlify.toml` pre-configurado:
1. Conecta tu repositorio de GitHub a [Netlify](https://www.netlify.com/).
2. Netlify detectará automáticamente:
   - **Build command:** `pnpm run build`
   - **Publish directory:** `dist`
3. ¡El juego estará en línea en segundos con HTTPS automático y CDN global!

---

## 👥 Modalidades de Jugabilidad (1 a 4 Jugadores / Equipos)
* **Modo Misiones Guiadas (1 Jugador):**
  - *Misión 1: El Péndulo Homeostático* (Servomecanismos y retardos).
  - *Misión 2: La Tormenta Entrópica de Shannon* (Gestión del ruido y negentropía).
  - *Misión 3: La Ley de Ashby y el Colapso Complejo* (Variedad de control vs crisis extremas).
* **Modo Torneo TGS (Multijugador / Equipos):**
  - Partida de **15 minutos** regresivos sincronizados con 15 ciclos decisionales.
  - Pase de mando por turnos con roles complementarios (*Director de Variedad*, *Operador de Entropía*, *Ingeniero de Feedback*).
  - Generación de **Reporte de Auditoría Sistémica** con puntuación matemática (0 - 1000 pts) y las **3 Preguntas de Análisis para el Docente**.
