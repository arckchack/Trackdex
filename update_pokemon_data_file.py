import json

with open('src/data/legendaries.json') as f:
    leg_data = json.load(f)

legendaries = set(leg_data['legendaries'])
mythicals = set(leg_data['mythicals'])

with open('src/data/pokemonData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We can add helper lookup exports or update the objects in POKEMON_LIST
# Adding helper sets LEGENDARY_IDS and MYTHICAL_IDS in pokemonData.ts makes it super easy and lightweight!
legendary_ts = f"export const LEGENDARY_IDS = new Set<number>({list(sorted(legendaries))});\n"
mythical_ts = f"export const MYTHICAL_IDS = new Set<number>({list(sorted(mythicals))});\n"

# Let's check if LEGENDARY_IDS is already present
if 'LEGENDARY_IDS' not in content:
    # Insert near top of pokemonData.ts
    content = content.replace("export const GENERATIONS_INFO =", f"{legendary_ts}{mythical_ts}\nexport const GENERATIONS_INFO =")

# Also, update POKEMON_LIST objects if needed, or helper function isLegendaryPokemon(id: number)
helper_func = """
export function isLegendaryPokemon(id: number): boolean {
  return LEGENDARY_IDS.has(id);
}

export function isMythicalPokemon(id: number): boolean {
  return MYTHICAL_IDS.has(id);
}
"""

if 'isLegendaryPokemon' not in content:
    content += "\n" + helper_func

with open('src/data/pokemonData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/data/pokemonData.ts with LEGENDARY_IDS and MYTHICAL_IDS!")
