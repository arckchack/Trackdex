// Cobblemon Spawn Locations & Biome Mapping for Minecraft
import { PokemonType } from '../types';
import { isLegendaryPokemon, isMythicalPokemon } from '../data/pokemonData';

export interface CobblemonSpawnInfo {
  biomes: string[];
  structures?: string[];
  timeOfDay: string; // 'Día', 'Noche', 'Cualquiera', 'Amanecer/Atardecer'
  weather?: string; // 'Lluvia', 'Tormenta Eléctrica', 'Despejado'
  environment: string; // 'Superficie', 'Subterráneo / Cuevas', 'En Agua', 'Aire', 'Nether', 'End'
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy Raro' | 'Ultra Raro (Legendario)';
  yLevels?: string;
  notes?: string;
}

// Special Legendaries and Mythicals customized locations in Cobblemon
const SPECIAL_LOCATIONS: Record<number, CobblemonSpawnInfo> = {
  // Gen 1 Legendaries
  144: { biomes: ['Picos Helados (Frozen Peaks)', 'Espinas de Hielo (Ice Spikes)', 'Océano Congelado'], timeOfDay: 'Día / Nevando', environment: 'Picos de Montaña', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y > 100', notes: 'Requiere clima nival / altar de hielo' },
  145: { biomes: ['Llanuras en Tormenta', 'Picos Rocosos', 'Sabana'], timeOfDay: 'Durante Tormentas Eléctricas', environment: 'Aire / Superficie', rarity: 'Ultra Raro (Legendario)', notes: 'Aparece durante tormentas eléctricas severas' },
  146: { biomes: ['Desierto', 'Badlands', 'Deltas de Basalto (Nether)'], timeOfDay: 'Día / Sol radiante', environment: 'Superficie / Nether', rarity: 'Ultra Raro (Legendario)', notes: 'Cerca de fuentes de lava o zonas volcánicas' },
  150: { biomes: ['Mansion del Bosque (Woodland Mansion)', 'Cueva Oscura'], timeOfDay: 'Noche', environment: 'Estructuras Especiales', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y < 20', notes: 'Raro spawn en laboratorios o mansiones' },
  151: { biomes: ['Selva Frondosa (Jungle)', 'Bosque de Bambú'], timeOfDay: 'Amanecer / Día', environment: 'Superficie / Copas de Árboles', rarity: 'Ultra Raro (Legendario)', notes: 'Suele spawnear invisible entre la vegetación densa' },

  // Gen 2 Legendaries
  243: { biomes: ['Llanuras', 'Sabana'], timeOfDay: 'Tormenta Eléctrica', environment: 'Superficie', rarity: 'Ultra Raro (Legendario)', notes: 'Aparece velozmente durante tempestades' },
  244: { biomes: ['Deltas de Basalto', 'Badlands', 'Cumbres Vivas'], timeOfDay: 'Cualquiera', environment: 'Nether / Volcánico', rarity: 'Ultra Raro (Legendario)' },
  245: { biomes: ['Ríos Fríos', 'Océano Transparente'], timeOfDay: 'Cualquiera / Lluvia', environment: 'En Agua', rarity: 'Ultra Raro (Legendario)' },
  249: { biomes: ['Océano Profundo (Deep Ocean)', 'Monumento Oceánico'], timeOfDay: 'Noche / Lluvia', environment: 'En Agua Profunda', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y < 40' },
  250: { biomes: ['Bosque de Abedules en Flor', 'Picos Soleados'], timeOfDay: 'Día', environment: 'Aire / Cielos', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y > 120' },
  251: { biomes: ['Bosque Oscuro (Dark Forest)', 'Arboleda de Cerezos'], timeOfDay: 'Día', environment: 'Superficie', rarity: 'Ultra Raro (Legendario)', notes: 'Suele vagar cerca de árboles antiguos' },

  // Gen 3 Legendaries
  382: { biomes: ['Océano Profundo', 'Fosa Marina'], timeOfDay: 'Bajo Tormenta / Lluvia', environment: 'Fondo del Océano', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y < 30' },
  383: { biomes: ['Badlands de Terracota', 'Valle de Arena de Almas (Nether)'], timeOfDay: 'Día despejado / Sol', environment: 'Superficie Desértica', rarity: 'Ultra Raro (Legendario)' },
  384: { biomes: ['Cielos Abiertos (Picos Supremos)', 'Isla Principal del End'], timeOfDay: 'Cualquiera', environment: 'Cielos / End', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y > 150' },

  // Gen 4 Legendaries
  483: { biomes: ['Ciudad del End (End City)', 'Distorsión'], timeOfDay: 'Cualquiera', environment: 'Dimensión del End', rarity: 'Ultra Raro (Legendario)' },
  484: { biomes: ['End Midlands', 'Anomalías del End'], timeOfDay: 'Cualquiera', environment: 'Dimensión del End', rarity: 'Ultra Raro (Legendario)' },
  487: { biomes: ['Bosque Carmesí (Nether)', 'Pielagós Oscuros'], timeOfDay: 'Noche', environment: 'Nether / Capas Profundas', rarity: 'Ultra Raro (Legendario)', yLevels: 'Y < -30' },
  493: { biomes: ['Altar Ancestral (Picos Divinos)', 'Centro del End'], timeOfDay: 'Cualquiera', environment: 'Picos Elevados / End', rarity: 'Ultra Raro (Legendario)' }
};

/**
 * Returns Cobblemon spawn locations in Minecraft biomes for any Pokemon ID
 */
export function getCobblemonSpawnInfo(pokemonId: number, types: PokemonType[]): CobblemonSpawnInfo {
  // Check if custom legendary location exists
  if (SPECIAL_LOCATIONS[pokemonId]) {
    return SPECIAL_LOCATIONS[pokemonId];
  }

  const isLeg = isLegendaryPokemon(pokemonId);
  const isMyth = isMythicalPokemon(pokemonId);

  const primaryType = types[0] || 'Normal';
  const secondaryType = types[1];

  let biomes: string[] = [];
  let structures: string[] = [];
  let timeOfDay = 'Cualquiera';
  let environment = 'Superficie';
  let rarity: CobblemonSpawnInfo['rarity'] = isLeg || isMyth ? 'Ultra Raro (Legendario)' : 'Común';
  let yLevels = 'Y: 60 - 120 (Superficie)';
  let notes = 'Aparece libremente en el mundo de Minecraft.';

  // Determine rarity based on ID / Legendary status
  if (isLeg || isMyth) {
    rarity = 'Ultra Raro (Legendario)';
    yLevels = 'Picos montañosos / Zonas especiales';
    notes = 'Spawn con probabilidad baja en estructuras o eventos de clima.';
  } else if (pokemonId % 7 === 0) {
    rarity = 'Muy Raro';
  } else if (pokemonId % 3 === 0) {
    rarity = 'Raro';
  } else if (pokemonId % 2 === 0) {
    rarity = 'Poco común';
  }

  // Type-based Biome Mapping for Cobblemon
  switch (primaryType) {
    case 'Agua':
      biomes = ['Océanos', 'Ríos', 'Playas', 'Pantanos (Swamp)', 'Lagunas'];
      environment = 'En Agua / Orillas';
      yLevels = 'Y: 30 - 64';
      notes = 'Aparece nadando en cuerpos de agua o en las orillas.';
      break;

    case 'Fuego':
      biomes = ['Desierto', 'Badlands (Mesa)', 'Deltas de Basalto', 'Bosque Carmesí (Nether)'];
      environment = 'Superficie Cálida / Nether';
      timeOfDay = 'Día / Soleado';
      yLevels = 'Y: 50 - 100';
      notes = 'Prefiere zonas de mucho calor, lava o el Nether.';
      break;

    case 'Planta':
      biomes = ['Bosques (Forest)', 'Praderas (Plains)', 'Selva (Jungle)', 'Arboledas'];
      environment = 'Superficie Vegetal';
      timeOfDay = 'Día';
      notes = 'Común en biomas con hierba alta, flores y follaje denso.';
      break;

    case 'Eléctrico':
      biomes = ['Sabana', 'Llanuras despejadas', 'Picos de Colinas', 'Ciudades del End'];
      environment = 'Superficie / Cielos';
      timeOfDay = 'Tormenta / Día';
      notes = 'Aumenta su frecuencia durante tormentas eléctricas.';
      break;

    case 'Bicho':
      biomes = ['Bosque Oscuro (Dark Forest)', 'Selva', 'Taiga', 'Praderas'];
      environment = 'Superficie / Copas de Árboles';
      timeOfDay = 'Día y Atardecer';
      notes = 'Suele habitar entre árboles y bloques de madera.';
      break;

    case 'Normal':
      biomes = ['Praderas (Plains)', 'Bosque de Abedules', 'Girasoles', 'Pueblos de Aldeanos'];
      environment = 'Superficie Terrestre';
      notes = 'Frecuente cerca de construcciones de aldeanos y praderas.';
      break;

    case 'Tierra':
    case 'Roca':
      biomes = ['Cuevas de Espeleotema (Dripstone)', 'Desiertos', 'Cañones', 'Badlands'];
      environment = 'Cuevas / Subterráneo';
      yLevels = 'Y: -30 - 50';
      notes = 'Común en niveles subterráneos de piedra y cuevas de goteo.';
      break;

    case 'Hielo':
      biomes = ['Picos Helados (Frozen Peaks)', 'Espinas de Hielo', 'Tundra Nival', 'Océano Congelado'];
      environment = 'Biomas Nevados';
      yLevels = 'Y: 80 - 140';
      notes = 'Aparece en bloques de nieve, hielo compacto y picos altos.';
      break;

    case 'Veneno':
      biomes = ['Pantanos (Swamps)', 'Bosque de Manglares', 'Valle de Arena de Almas (Nether)'];
      environment = 'Agua Estancada / Superficie';
      timeOfDay = 'Noche y Atardecer';
      notes = 'Habita en zonas cenagosas y aguas turbias.';
      break;

    case 'Volador':
      biomes = ['Cielos de Llanura', 'Picos Montañosos', 'Praderas Elevadas'];
      environment = 'Aire / Cielos';
      yLevels = 'Y: 80 - 160';
      notes = 'Vuela libremente sobre las copas de los árboles y colinas.';
      break;

    case 'Psíquico':
      biomes = ['Bosque de Cerezos (Cherry Grove)', 'Praderas Florales', 'Ciudades del End'];
      environment = 'Superficie Mística / End';
      timeOfDay = 'Atardecer / Noche';
      notes = 'Frecuenta zonas de alta magia y dimensiones alternas.';
      break;

    case 'Fantasma':
    case 'Siniestro':
      biomes = ['Bosque Oscuro (Dark Forest)', 'Mansión del Bosque', 'Cuevas Profundas (Deepslate)', 'Valle de Arena de Almas'];
      environment = 'Subterráneo / Noche';
      timeOfDay = 'Noche';
      yLevels = 'Y < 20';
      notes = 'Solo aparece durante la noche o en zonas de oscuridad absoluta (Y < 0).';
      break;

    case 'Dragón':
      biomes = ['Picos Jagged', 'Cumbres Montañosas', 'End Highlands', 'Bosque de Bambú'];
      environment = 'Montañas / End';
      rarity = isLeg ? 'Ultra Raro (Legendario)' : 'Raro';
      yLevels = 'Y: 90 - 180';
      notes = 'Prefiere las cumbres más elevadas o la dimensión del End.';
      break;

    case 'Acero':
      biomes = ['Cuevas de Piedra Profunda (Deepslate)', 'Minas Abandonadas (Mineshafts)', 'Fortalezas'];
      environment = 'Subterráneo Profundo';
      yLevels = 'Y: -50 - 10';
      notes = 'Habita cerca de vetas de hierro y capas subterráneas profundas.';
      break;

    case 'Hada':
      biomes = ['Bosque de Cerezos', 'Pradera de Flores (Flower Forest)', 'Campos de Champiñones'];
      environment = 'Superficie Floreada';
      timeOfDay = 'Día y Noche';
      notes = 'Aparece rodeado de vegetación mística y flores coloridas.';
      break;

    case 'Lucha':
      biomes = ['Picos Rocosos', 'Sabana Espinosa', 'Desiertos'];
      environment = 'Superficie Elevada';
      timeOfDay = 'Día';
      notes = 'Aparece cerca de terrenos rocosos y de entrenamiento.';
      break;
  }

  // Adjust secondary type highlights
  if (secondaryType === 'Volador') {
    environment = 'Aire / Superficie Elevada';
  } else if (secondaryType === 'Fantasma' || secondaryType === 'Siniestro') {
    timeOfDay = 'Noche';
  } else if (secondaryType === 'Agua') {
    biomes.push('Ríos y Lagos');
  }

  return {
    biomes,
    structures: structures.length > 0 ? structures : undefined,
    timeOfDay,
    environment,
    rarity,
    yLevels,
    notes
  };
}
