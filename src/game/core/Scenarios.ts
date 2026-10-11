import type { MissionScenario } from './Types';

export const DIDACTIC_SCENARIOS: MissionScenario[] = [
  {
    id: 'scenario_1_pendulum',
    level: 1,
    title: 'Misión 1: El Péndulo Homeostático',
    subtitle: 'Dominando Bucles de Retroalimentación Negativa y Retardos',
    description: 'Aprende a regular el servomecanismo de control sin provocar sobre-oscilaciones. Comprende que una decisión con retardo no debe ser duplicada impulsivamente.',
    focusTopic: 'Cibernética y Servomecanismos (Norbert Wiener)',
    targetCycles: 10,
    initialVars: {
      homeostasis: 55,
      entropy: 35,
      energy: 70,
      viability: 85,
      temperature: 24,
      sensorNoise: 10,
      controlVariety: 2,
      environmentVariety: 2,
      accumulatedNegentropy: 0,
      servomechanismGain: 1.5
    },
    allowedPolicies: [
      'calibrate_servomechanism',
      'predictive_inertia_filter',
      'inject_negentropy',
      'recharge_energy_flow',
      'thermal_dissipation'
    ],
    victoryCriteria: {
      minHomeostasis: 70,
      maxEntropy: 45,
      minViability: 65
    },
    learningObjective: 'Demostrar que los bucles equilibradores (Balancing Loops) requieren paciencia frente a la inercia temporal para evitar la resonancia destructiva.'
  },
  {
    id: 'scenario_2_shannon',
    level: 2,
    title: 'Misión 2: La Tormenta Entrópica de Shannon',
    subtitle: 'Ruido en los Canales y el Poder de la Negentropía',
    description: 'La estación se adentra en un cinturón de radiación. La entropía informacional ciega a los instrumentos. Debes inyectar negentropía para recuperar la certidumbre.',
    focusTopic: 'Entropía en la Información (Claude Shannon) y Negentropía (Schrödinger/Brillouin)',
    targetCycles: 12,
    initialVars: {
      homeostasis: 60,
      entropy: 65,
      energy: 60,
      viability: 75,
      temperature: 27,
      sensorNoise: 50,
      controlVariety: 2,
      environmentVariety: 3,
      accumulatedNegentropy: 0,
      servomechanismGain: 1.0
    },
    allowedPolicies: [
      'inject_negentropy',
      'sensor_redundancy_filter',
      'calibrate_servomechanism',
      'recharge_energy_flow',
      'emergency_decoupling',
      'thermal_dissipation'
    ],
    victoryCriteria: {
      minHomeostasis: 65,
      maxEntropy: 35,
      minViability: 60
    },
    learningObjective: 'Experimentar cómo la falta de información clara (alta entropía) descalibra las decisiones y cómo la negentropía preserva la estructura del sistema.'
  },
  {
    id: 'scenario_3_ashby',
    level: 3,
    title: 'Misión 3: La Ley de Ashby y el Colapso Complejo',
    subtitle: 'Variedad de Control vs Variedad del Entorno',
    description: 'Perturbaciones multivariables azotan la biosfera. Si tu variedad de control no iguala o supera a las crisis externas, la viabilidad colapsará sin remedio.',
    focusTopic: 'Ley de Variedad Requerida de W. Ross Ashby y Teoría de la Decisión Multiobjetivo',
    targetCycles: 15,
    initialVars: {
      homeostasis: 50,
      entropy: 40,
      energy: 65,
      viability: 70,
      temperature: 28,
      sensorNoise: 20,
      controlVariety: 1, // High deficit initially!
      environmentVariety: 3,
      accumulatedNegentropy: 0,
      servomechanismGain: 1.0
    },
    allowedPolicies: [
      'expand_ashby_variety',
      'inject_negentropy',
      'calibrate_servomechanism',
      'thermal_dissipation',
      'emergency_decoupling',
      'predictive_inertia_filter',
      'recharge_energy_flow',
      'sensor_redundancy_filter'
    ],
    victoryCriteria: {
      minHomeostasis: 75,
      maxEntropy: 40,
      minViability: 70
    },
    learningObjective: 'Comprobar de forma empírica la Ley de Ashby: solo la variedad del regulador puede absorber y destruir la variedad de las amenazas del entorno.'
  }
];
