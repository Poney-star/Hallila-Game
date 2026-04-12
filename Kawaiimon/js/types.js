export const TYPE_COLORS = {
  Feu: "type-Feu",
  Eau: "type-Eau",
  Plante: "type-Plante",
  Acier: "type-Acier",
  Vol: "type-Vol",
  Poison: "type-Poison",
  Sol: "type-Sol",
  Glace: "type-Glace",
  Psy: "type-Psy",
  Ténèbres: "type-Ténèbres",
  Combat: "type-Combat",
  Normal: "type-Normal",
};

export const TYPE_EFFECTIVENESS = {
  Feu: { Plante: 1.5, Glace: 1.4, Eau: 0.7, Sol: 0.8 },
  Eau: { Feu: 1.5, Sol: 1.3, Plante: 0.7 },
  Plante: { Eau: 1.5, Sol: 1.3, Feu: 0.7, Vol: 0.8 },
  Acier: { Glace: 1.5, Feu: 0.8, Combat: 0.8 },
  Vol: { Plante: 1.5, Combat: 1.3, Glace: 0.8 },
  Poison: { Plante: 1.5, Acier: 0.7 },
  Sol: { Feu: 1.5, Acier: 1.5, Vol: 0.6, Plante: 0.8 },
  Glace: { Vol: 1.4, Plante: 1.4, Eau: 0.9, Feu: 0.8 },
  Psy: { Poison: 1.5, Ténèbres: 0.8 },
  Ténèbres: { Psy: 1.5, Combat: 0.85 },
  Combat: { Acier: 1.5, Ténèbres: 1.3, Vol: 0.8 },
  Normal: {},
};

export function effectiveness(moveType, targetType) {
  return TYPE_EFFECTIVENESS[moveType]?.[targetType] ?? 1;
}

export function effectivenessLabel(multiplier) {
  if (multiplier >= 1.35) return "BONUS ++";
  if (multiplier <= 0.8) return "MALUS --";
  return "NEUTRE";
}

export function badge(type) {
  return `<span class="badge ${TYPE_COLORS[type] || TYPE_COLORS.Normal}">${type}</span>`;
}
