# MANUAL DE REGLAS Y GUÍA DE JUEGO
## CYBER-SYN: PROTOCOLO HOMEOSTASIS
### Simulador Estratégico de Dinámica Cibernética y Teoría General de Sistemas (TGS)

---

## 1. INTRODUCCIÓN Y CONTEXTO NARRATIVO
En el año 2145, la estación orbital biosférica **"Sintropía-I"** representa el mayor logro de la ingeniería de sistemas: un ecosistema artificial cerrado que alberga a 50.000 habitantes en la órbita del planeta Kepler-42. 

Sin embargo, el equilibrio de la biosfera es ultra-sensible. Las tormentas de radiación cósmica, los micro-meteoritos y los picos de demanda interna someten al sistema a constantes perturbaciones. Tu equipo ha sido designado como la **Unidad de Regulación Cibernética**, inspirada en los principios de Norbert Wiener, Stafford Beer, W. Ross Ashby y Ludwig von Bertalanffy.

Tu misión no es gobernar con órdenes dictatoriales simples, sino **comprender y modular los bucles de retroalimentación**, absorber la variedad de las perturbaciones del entorno y evitar el colapso entrópico de la colonia.

---

## 2. EL SISTEMA Y SUS SUBSISTEMAS
El juego modela un **Macro-Sistema Abierto y Complejo**, compuesto por cuatro subsistemas estrechamente interconectados:

```
        ┌─────────────────────────────────────────────────────────────┐
        │                  ENTORNO EXTERIOR (COSMOS)                  │
        │   [Perturbaciones: Tormentas Solares, Fallas Estocásticas]  │
        └──────────────────────────────┬──────────────────────────────┘
                                       │ Variedad Externa (Ve)
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │                   BIÓPOLIS SISTRÓPICA-I                     │
        │                                                             │
        │   ┌───────────────────┐             ┌───────────────────┐   │
        │   │    SUBSISTEMA     │◄───────────►│    SUBSISTEMA     │   │
        │   │    ENERGÉTICO     │  Calor /    │  DE INFORMACIÓN   │   │
        │   │ (Flujo & Potencia)│  Disipación │(Shannon / Ruido H)│   │
        │   └─────────▲─────────┘             └─────────▲─────────┘   │
        │             │                                 │             │
        │             │ Feedback                        │ Señales     │
        │             ▼                                 ▼             │
        │   ┌───────────────────┐             ┌───────────────────┐   │
        │   │    SUBSISTEMA     │             │    SUBSISTEMA     │   │
        │   │ DE CONTROL CIBER  │◄───────────►│ SOCIAL / VIABLE   │   │
        │   │(Servomecanismos)  │   Acciones  │(Cohesión & Salud) │   │
        │   └───────────────────┘             └───────────────────┘   │
        └─────────────────────────────────────────────────────────────┘
```

1. **Subsistema Energético:** Genera y distribuye la energía necesaria para el soporte vital. Si se sobrecarga, produce calor térmico excesivo que perturba las telecomunicaciones.
2. **Subsistema de Información (Claude Shannon):** Red de transmisión de datos. Cuando el ruido y la radiación aumentan, la **Entropía Informacional ($H$)** se dispara, provocando que los sensores falseen sus lecturas.
3. **Subsistema de Control Cibernético:** El cerebro de la estación. Integra sensores, un comparador contra el punto de consigna (*Setpoint*) y servomecanismos homeostáticos que ejecutan políticas con **retardos temporales (Delays)**.
4. **Subsistema Social / Viabilidad Sistémica:** Representa la integridad estructural, la salud de los colonos y la sostenibilidad a largo plazo.

---

## 3. VARIABLES PRINCIPALES DEL PANEL DE CONTROL (HUD)

| Indicador | Rango Óptimo | Significado Sistémico | Riesgo de Desvío |
| :--- | :---: | :--- | :--- |
| **Homeostasis (Estabilidad)** | **70% - 100%** | Mide el equilibrio dinámico del sistema y la efectividad de los amortiguadores. | Si baja del 30%, el sistema entra en oscilación errática peligrosa. |
| **Entropía Informacional ($H$)** | **0% - 35%** | Nivel de desorden e incertidumbre en los canales de comunicación (Shannon). | Si supera el 70%, los sensores reportan datos con ruido y se dispara un bucle destructivo. |
| **Reserva Energética / Flujo** | **40% - 80%** | Capacidad termodinámica disponible para ejecutar políticas y sostener la biosfera. | $<20\%$ provoca apagón de subsistemas; $>90\%$ genera sobrecalentamiento entrópico. |
| **Cociente de Variedad de Ashby** | **$\ge 1.0$** | Relación entre la variedad del controlador ($V_C$) y la variedad del entorno ($V_E$). | Si $V_C < V_E$, el sistema no tiene capacidad para absorber las crisis del entorno. |
| **Viabilidad Sistémica** | **50% - 100%** | Salud integral y cohesión autopoietica de la estación (Stafford Beer). | **Si llega a 0%, ¡GAME OVER por colapso sistémico!** |

---

## 4. DINÁMICA DE LA PARTIDA Y FASES DE UN CICLO
La partida se estructura en **15 Ciclos de Decisión** (aproximadamente 1 minuto por ciclo, completando los **15 minutos oficiales del torneo**).

En cada ciclo ocurren 4 fases automáticas:

### Fase 1: Ingesta de Perturbación del Entorno (Input)
El entorno espacial genera un evento estocástico con un grado de variedad $V_E$ (ej. *Tormenta de Neutrones*, *Fuga de Refrigerante*, *Pico de Consumo Comunitario*).

### Fase 2: Telemetría y Causalidad en Vivo (Throughput)
Los sensores leen el estado. Si la **Entropía** es alta, las lecturas del HUD parpadean con márgenes de error. El **Diagrama de Bucles Causales (CLD)** muestra el flujo de las fuerzas en conflicto mediante flechas animadas:
- **Flechas Azules (B - Balancing):** Fuerzas que intentan devolver el sistema al equilibrio.
- **Flechas Rojas (R - Reinforcing):** Fuerzas acumulativas que amplifican la desviación.

### Fase 3: Toma de Decisiones Cibernéticas (Decisión bajo Incertidumbre)
El jugador o equipo selecciona **1 o 2 Políticas Sistémicas** del catálogo interactivo. Cada política consume recursos, aporta variedad y tiene un **Retardo Temporal (Delay)** de 0 a 2 ciclos.

### Fase 4: Ejecución del Servomecanismo y Resolución de Retardos (Output & Feedback)
Las políticas del ciclo actual y las que estaban en tránsito por *delays* anteriores impactan el sistema. El comparador calcula el error de homeostasis y actualiza la viabilidad de la estación.

---

## 5. CATÁLOGO DE POLÍTICAS CIBERNÉTICAS

| Política | Costo Energía | Retardo | Efecto Inmediato | Efecto de Retardo / Sistémico |
| :--- | :---: | :---: | :--- | :--- |
| **Inyección de Negentropía** | $-15$ | 0 ciclos | Reduce la Entropía en $-25\%$ y depura el ruido de los sensores. | Clarifica los diagnósticos para los siguientes 2 ciclos. |
| **Calibrar Ganancia Homeostática** | $-10$ | 1 ciclo | Ajusta el servomecanismo hacia amortiguamiento crítico. | Aumenta la Homeostasis en $+20\%$ en el ciclo siguiente. |
| **Expansión de Variedad de Ashby** | $-20$ | 1 ciclo | Otorga $+2$ puntos de Variedad de Control ($V_C$). | Permite neutralizar perturbaciones complejas del entorno. |
| **Filtro Predictivo de Inercia** | $-10$ | 0 ciclos | Reduce en 1 ciclo los retardos pendientes de políticas previas. | Evita la sobre-oscilación producida por decisiones tardías. |
| **Desacoplamiento de Emergencia** | $-5$ | 0 ciclos | Aísla un subsistema en crisis, frenando el efecto dominó. | Reduce temporalmente la Viabilidad Social en $-8\%$. |
| **Optimizar Disipación Térmica** | $-12$ | 1 ciclo | Reduce el calentamiento de la biosfera y evita picos de ruido. | Previene la activación del bucle reforzador destructivo R1. |

---

## 6. MODOS DE JUEGO

### Modo 1: Misiones Didácticas Individuales (1 Jugador)
Diseñado para que cualquier estudiante o docente aprenda los conceptos paso a paso:
- **Nivel 1: El Péndulo Homeostático:** Aprende a controlar bucles equilibradores y tolerar retardos sin sobre-reaccionar.
- **Nivel 2: La Tormenta de Shannon:** Enfrenta alta entropía y sensores ruidosos; domina la inyección estratégica de negentropía.
- **Nivel 3: La Ley de Ashby y el Colapso Complejo:** Gestiona crisis multivariables equilibrando la variedad del regulador.

### Modo 2: Modo Torneo TGS (Multijugador 1 a 4 Jugadores / Equipos)
Diseñado para la dinámica de aula descrita en el **numeral 7 de la guía del torneo**:
- **Cronómetro Oficial:** Partida de **15 minutos** regresivos.
- **Modo Rotativo de Roles Cibernéticos (Pase y Juegue):**
  - *Jugador/Equipo A:* **Director de Variedad** (decide políticas de expansión de Ashby y contingencias).
  - *Jugador/Equipo B:* **Operador de Entropía** (administra la negentropía y la fidelidad de sensores).
  - *Jugador/Equipo C:* **Ingeniero de Retroalimentación** (calibra los servomecanismos y amortiguadores).
- **Semilla Competitiva Idéntica:** Permite que diferentes equipos jueguen exactamente la misma secuencia de perturbaciones estocásticas para comparar quién tiene la mejor estrategia sistémica.

---

## 7. CÓMO PENSAR SISTÉMICAMENTE PARA GANAR (GUÍA ESTRATÉGICA)
*(Aplicación práctica de la Regla de Oro)*

1. **No caigas en la trampa del síntoma:** Si la energía está baja, no aumentes ciegamente la generación al 100%. El calor generado aumentará la entropía y destruirá la información del sensor en el turno siguiente.
2. **Respeta los retardos temporales (Delays):** Si aplicaste una calibración homeostática con delay de 1 ciclo, **¡espera a que impacte!** Si aplicas otra inmediatamente pensando que no funcionó, recibirás un doble impacto que provocará una sobreoscilación armónica destructiva.
3. **Mantén $V_C \ge V_E$ (Ley de Ashby):** Observa la variedad esperada de las tormentas. Si el entorno amenaza con variedad 3 o 4, expande tu variedad de control antes de que ocurra la perturbación.
4. **La Negentropía es tu seguro de vida:** Cuando la entropía supera el 50%, las decisiones son ciegas. Inyectar negentropía para mantener claros los canales de información siempre rinde frutos.

---

## 8. SISTEMA DE PUNTUACIÓN Y AUDITORÍA FINAL
Al finalizar los 15 ciclos, el simulador calcula el **Puntaje de Eficiencia Cibernética (PEC)**:

$$PEC = (\overline{\text{Homeostasis}} \times 4.0) + (\text{Viabilidad Final} \times 3.5) + (\text{Negentropía Acumulada} \times 2.5) - \text{Penalizaciones}$$

### Escala de Reconocimiento Cibernético:
- **900 a 1000 Puntos:** **Maestro Cibernético (Rango W. Ross Ashby)** — Comprensión sistémica magistral, control óptimo de variedad y mínima oscilación.
- **750 a 899 Puntos:** **Regulador Homeostático (Rango Norbert Wiener)** — Buen manejo de bucles equilibradores y gestión adecuada de retardos.
- **600 a 749 Puntos:** **Gestor Sistémico Adaptativo (Rango Ludwig von Bertalanffy)** — Supervivencia lograda con episodios de inestabilidad moderada.
- **Menos de 600 Puntos:** **Régimen Entrópico Inestable** — Predominio de pensamiento lineal o fallas en la contención de bucles destructivos.
