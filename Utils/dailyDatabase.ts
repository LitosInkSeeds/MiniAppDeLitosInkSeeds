
export const BREATH_DB = Array(28).fill(null).map((_, i) => ({
    name: `Respiración Fase ${i + 1}`,
    desc: "Enfócate en tu flujo vital y la conexión con el ahora."
}));

export const STRETCH_DB = Array(28).fill(null).map((_, i) => ({
    name: `Estiramiento Solar ${i + 1}`,
    desc: "Abre tus canales energéticos con movimientos suaves."
}));

export const GYM_DB = Array(28).fill(null).map((_, i) => ({
    name: `Entreno Natural ${i + 1}`,
    desc: "Mueve tu cuerpo respetando su diseño biológico."
}));

export const QUOTES_SPIRIT_DB = Array(28).fill(null).map((_, i) => [
    "Busca el silencio y encontrarás la luz.",
    "El presente es el único regalo real.",
    "La paz nace desde la aceptación.",
    "Eres un reflejo del cosmos.",
    "Confía en el proceso de la vida."
]);
