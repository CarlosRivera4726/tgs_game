import type { CyberneticPolicy, SystemVariables } from './Types';

export const CYBERNETIC_POLICIES: CyberneticPolicy[] = [
  {
    id: 'inject_negentropy',
    title: 'Inyección de Negentropía Informacional',
    subsystem: 'entropia',
    energyCost: 15,
    delayCycles: 0,
    icon: '⚡',
    description: 'Consume energía computacional para reorganizar el canal y depurar el ruido de Shannon.',
    systemicExplanation: 'Aplica el principio de Brillouin y Schrödinger: la negentropía es la absorción de orden para contrarrestar la tendencia natural al desorden informacional.',
    canExecute: (vars: SystemVariables) => vars.energy >= 15,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 15);
      const entropyReduction = 24;
      vars.entropy = Math.max(5, vars.entropy - entropyReduction);
      vars.sensorNoise = Math.max(0, vars.sensorNoise - 30);
      vars.accumulatedNegentropy += entropyReduction;
      vars.homeostasis = Math.min(100, vars.homeostasis + 8);
      return {
        immediateMessage: 'Orden informacional restaurado (-24% Entropía). Los sensores transmiten señales claras sin ruido.'
      };
    }
  },
  {
    id: 'calibrate_servomechanism',
    title: 'Calibrar Ganancia Homeostática',
    subsystem: 'cibernetica',
    energyCost: 10,
    delayCycles: 1,
    icon: '🎯',
    description: 'Ajusta la sensibilidad del bucle de retroalimentación negativa hacia amortiguamiento crítico.',
    systemicExplanation: 'Regula el servomecanismo de control (Wiener). Una ganancia equilibrada neutraliza desviaciones sin inducir sobreoscilaciones.',
    canExecute: (vars: SystemVariables) => vars.energy >= 10,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 10);
      return {
        immediateMessage: 'Comando enviado al comparador homeostático. El ajuste entrará en fase en el próximo ciclo (Delay 1).',
        delayedAction: {
          id: 'delay_gain_' + Math.random().toString(36).substring(2, 7),
          policyId: 'calibrate_servomechanism',
          policyName: 'Calibración Homeostática',
          totalCycles: 1,
          remainingCycles: 1,
          description: 'Estabilización del servomecanismo completada (+22% Homeostasis).',
          apply: (v: SystemVariables) => {
            v.servomechanismGain = 1.0;
            v.homeostasis = Math.min(100, v.homeostasis + 22);
            v.temperature = Math.max(18, Math.min(25, v.temperature * 0.9 + 2.1));
          }
        }
      };
    }
  },
  {
    id: 'expand_ashby_variety',
    title: 'Expansión de Variedad de Ashby',
    subsystem: 'ashby',
    energyCost: 18,
    delayCycles: 1,
    icon: '🛡️',
    description: 'Despliega subsistemas redundantes para absorber perturbaciones complejas del entorno.',
    systemicExplanation: 'Ley de Variedad Requerida de Ross Ashby: "Solo la variedad puede absorber variedad". Aumenta la capacidad de respuesta frente a crisis.',
    canExecute: (vars: SystemVariables) => vars.energy >= 18,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 18);
      return {
        immediateMessage: 'Inicializando módulos de contingencia adaptativa. Disponibles en el siguiente ciclo (Delay 1).',
        delayedAction: {
          id: 'delay_ashby_' + Math.random().toString(36).substring(2, 7),
          policyId: 'expand_ashby_variety',
          policyName: 'Expansión de Variedad de Ashby',
          totalCycles: 1,
          remainingCycles: 1,
          description: 'Variedad de control expandida (+2 Vc). La biosfera puede mitigar eventos externos de alta complejidad.',
          apply: (v: SystemVariables) => {
            v.controlVariety += 2;
            v.viability = Math.min(100, v.viability + 10);
          }
        }
      };
    }
  },
  {
    id: 'predictive_inertia_filter',
    title: 'Filtro Predictivo de Inercia',
    subsystem: 'cibernetica',
    energyCost: 12,
    delayCycles: 0,
    icon: '⏳',
    description: 'Compensa matemáticamente los retardos temporales pendientes, acelerando su absorción.',
    systemicExplanation: 'Mitiga el dilema de los retardos (Delays) en dinámica de sistemas, evitando que los actuadores apliquen correcciones desfasadas.',
    canExecute: (vars: SystemVariables) => vars.energy >= 12,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 12);
      vars.homeostasis = Math.min(100, vars.homeostasis + 10);
      return {
        immediateMessage: 'Compensación predictiva activada. Se reduce la latencia de respuesta de los servomecanismos.'
      };
    }
  },
  {
    id: 'thermal_dissipation',
    title: 'Optimizar Disipación Térmica',
    subsystem: 'energia',
    energyCost: 14,
    delayCycles: 1,
    icon: '❄️',
    description: 'Activa radiadores y bombas criogénicas para disipar el calor excesivo hacia el espacio.',
    systemicExplanation: 'Termodinámica de sistemas abiertos (Bertalanffy): evacúa calor hacia el entorno para prevenir la degradación de los canales de comunicación.',
    canExecute: (vars: SystemVariables) => vars.energy >= 14,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 14);
      return {
        immediateMessage: 'Conductos de disipación desplegados. Temperatura descenderá al estabilizarse (Delay 1).',
        delayedAction: {
          id: 'delay_cool_' + Math.random().toString(36).substring(2, 7),
          policyId: 'thermal_dissipation',
          policyName: 'Disipación Térmica',
          totalCycles: 1,
          remainingCycles: 1,
          description: 'Temperatura normalizada (-8°C). Se neutraliza el bucle reforzador destructivo de sobrecalentamiento.',
          apply: (v: SystemVariables) => {
            v.temperature = Math.max(20, v.temperature - 8);
            v.entropy = Math.max(5, v.entropy - 12);
          }
        }
      };
    }
  },
  {
    id: 'emergency_decoupling',
    title: 'Desacoplamiento Modular de Emergencia',
    subsystem: 'estructura',
    energyCost: 5,
    delayCycles: 0,
    icon: '✂️',
    description: 'Aísla temporalmente un subsistema crítico para cortar el efecto dominó de una crisis.',
    systemicExplanation: 'Modularidad y cuasi-descomponibilidad (Herbert Simon): sacrifica transitoriamente cohesión global para salvar la viabilidad esencial.',
    canExecute: (vars: SystemVariables) => vars.energy >= 5,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 5);
      vars.entropy = Math.max(10, vars.entropy - 18);
      // Cost of decoupling: small temporary hit to social viability
      vars.viability = Math.max(20, vars.viability - 6);
      vars.homeostasis = Math.min(100, vars.homeostasis + 14);
      return {
        immediateMessage: 'Subsistema aislado con éxito. Contención del colapso lograda (-18% Entropía, -6% Viabilidad Social).'
      };
    }
  },
  {
    id: 'recharge_energy_flow',
    title: 'Redistribución de Flujo Termodinámico',
    subsystem: 'energia',
    energyCost: 0,
    delayCycles: 1,
    icon: '🔋',
    description: 'Canaliza los reactores fotovoltaicos auxiliares para recuperar reserva energética.',
    systemicExplanation: 'Intercambio constante con el entorno exterior necesario para mantener sistemas abiertos fuera del equilibrio termodinámico de muerte térmica.',
    canExecute: (_vars: SystemVariables) => true,
    execute: (vars: SystemVariables) => {
      return {
        immediateMessage: 'Canalizando paneles solares hacia acumuladores (Delay 1). Precaución: genera calor residual.',
        delayedAction: {
          id: 'delay_energy_' + Math.random().toString(36).substring(2, 7),
          policyId: 'recharge_energy_flow',
          policyName: 'Recarga Termodinámica',
          totalCycles: 1,
          remainingCycles: 1,
          description: 'Reserva energética recargada (+35 Energía, +4°C Temperatura residual).',
          apply: (v: SystemVariables) => {
            v.energy = Math.min(100, v.energy + 35);
            v.temperature += 4;
          }
        }
      };
    }
  },
  {
    id: 'sensor_redundancy_filter',
    title: 'Filtro de Redundancia de Sensores',
    subsystem: 'entropia',
    energyCost: 10,
    delayCycles: 0,
    icon: '📡',
    description: 'Aplica votación por mayoría y filtros de Kalman para eliminar lecturas falsas causadas por ruido.',
    systemicExplanation: 'Teoría de la información de Shannon: la redundancia en el canal permite la detección y corrección de errores frente a fuentes de ruido blanco.',
    canExecute: (vars: SystemVariables) => vars.energy >= 10,
    execute: (vars: SystemVariables) => {
      vars.energy = Math.max(0, vars.energy - 10);
      vars.sensorNoise = 0;
      vars.homeostasis = Math.min(100, vars.homeostasis + 12);
      return {
        immediateMessage: 'Filtros de Kalman acoplados. Ruido de sensores neutralizado a 0%.'
      };
    }
  }
];
