import type { EnvironmentPerturbation, SystemVariables } from './Types';

export const ENVIRONMENT_EVENTS: EnvironmentPerturbation[] = [
  {
    id: 'solar_radiation_storm',
    title: 'Tormenta de Radiación Solar',
    variety: 3,
    description: 'Una llamarada solar ioniza el canal de comunicaciones de la estación, introduciendo ruido blanco y calor residual.',
    systemicArchetype: 'Degradación entrópica del canal de Shannon y sobrecarga térmica externa.',
    impact: (vars: SystemVariables) => {
      const varietyDeficit = Math.max(0, 3 - vars.controlVariety);
      vars.environmentVariety = 3;
      vars.entropy = Math.min(100, vars.entropy + 22 + varietyDeficit * 6);
      vars.sensorNoise = Math.min(100, vars.sensorNoise + 35);
      vars.temperature += 5;
      vars.homeostasis = Math.max(10, vars.homeostasis - (15 + varietyDeficit * 5));
      if (varietyDeficit > 0) {
        vars.viability = Math.max(10, vars.viability - varietyDeficit * 8);
        return `Impacto severo por déficit de variedad de Ashby (Vc < Ve): +${22 + varietyDeficit * 6}% Entropía, -${varietyDeficit * 8}% Viabilidad.`;
      }
      return 'La variedad de control amortiguó el impacto directo, pero la entropía informacional aumentó +22%.';
    }
  },
  {
    id: 'micrometeoroid_hull_impact',
    title: 'Lluvia de Micro-Meteoritos',
    variety: 2,
    description: 'Partículas de alta velocidad impactan los radiadores externos, afectando la disipación térmica.',
    systemicArchetype: 'Perturbación física en los límites del sistema abierto (frontera permeable).',
    impact: (vars: SystemVariables) => {
      vars.environmentVariety = 2;
      const varietyDeficit = Math.max(0, 2 - vars.controlVariety);
      vars.temperature += 7;
      vars.homeostasis = Math.max(15, vars.homeostasis - 14);
      if (varietyDeficit > 0) {
        vars.viability = Math.max(10, vars.viability - 12);
        return `Fuga térmica por falta de respuesta modular: +7°C Temperatura, -12% Viabilidad.`;
      }
      return 'Sellado automático de contingencia aplicado. Temperatura aumenta +7°C.';
    }
  },
  {
    id: 'biosphere_consumption_spike',
    title: 'Pico Crítico de Demanda Comunitaria',
    variety: 2,
    description: 'La población activa sistemas de soporte vital adicionales. Retira energía de los acumuladores.',
    systemicArchetype: 'Acoplamiento social-tecnológico: el subsistema social presiona al subsistema energético.',
    impact: (vars: SystemVariables) => {
      vars.environmentVariety = 2;
      vars.energy = Math.max(0, vars.energy - 20);
      vars.homeostasis = Math.max(15, vars.homeostasis - 10);
      return 'Reserva energética reducida en -20 unidades para sostener el consumo biosférico.';
    }
  },
  {
    id: 'clock_sync_jitter',
    title: 'Desincronización de Reloj en Servomecanismos',
    variety: 3,
    description: 'Un fallo de jitter en la red desincroniza los sensores de los actuadores, aumentando la inercia de retroalimentación.',
    systemicArchetype: 'Aparición de retardos temporales (Delays) no previstos en el bucle de realimentación.',
    impact: (vars: SystemVariables) => {
      vars.environmentVariety = 3;
      vars.servomechanismGain = 1.8; // High oscillatory gain
      vars.homeostasis = Math.max(10, vars.homeostasis - 18);
      vars.entropy = Math.min(100, vars.entropy + 14);
      return 'Alerta: El bucle cibernético ha entrado en fase sobre-oscilatoria por desincronización de retardo.';
    }
  },
  {
    id: 'quantum_electromagnetic_pulse',
    title: 'Pulso Electromagnético de Fondo Cósmico',
    variety: 4,
    description: 'Una onda electromagnética compleja pone a prueba simultáneamente la variedad de control y la claridad informacional.',
    systemicArchetype: 'Prueba extrema de la Ley de Ashby: perturbación multivariable de alta variedad.',
    impact: (vars: SystemVariables) => {
      vars.environmentVariety = 4;
      const deficit = Math.max(0, 4 - vars.controlVariety);
      vars.entropy = Math.min(100, vars.entropy + 28);
      vars.sensorNoise = Math.min(100, vars.sensorNoise + 40);
      vars.homeostasis = Math.max(10, vars.homeostasis - 20);
      if (deficit > 0) {
        vars.viability = Math.max(10, vars.viability - deficit * 9);
        return `¡Déficit crítico de Ashby de grado ${deficit}! La estación absorbe daño estructural (-${deficit * 9}% Viabilidad).`;
      }
      return '¡La alta variedad del controlador absorbió con éxito la onda electromagnética!';
    }
  },
  {
    id: 'cosmic_stability_window',
    title: 'Ventana de Calma Cosmológica',
    variety: 1,
    description: 'El entorno espacial permanece en reposo. Oportunidad ideal para restaurar la homeostasis y acumular negentropía.',
    systemicArchetype: 'Entorno de baja variedad: permite la regeneración autopoietica del sistema.',
    impact: (vars: SystemVariables) => {
      vars.environmentVariety = 1;
      vars.homeostasis = Math.min(100, vars.homeostasis + 12);
      vars.energy = Math.min(100, vars.energy + 10);
      vars.entropy = Math.max(0, vars.entropy - 8);
      return 'Condiciones estables. Autopoiesis biosférica activa (+12% Homeostasis, -8% Entropía).';
    }
  }
];
