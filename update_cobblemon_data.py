import urllib.request
import csv
import json
import io

BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'

def fetch_csv(filename):
    url = BASE_URL + filename
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        text = resp.read().decode('utf-8')
        return list(csv.DictReader(io.StringIO(text)))

print("Fetching species CSV...")
species_rows = fetch_csv('pokemon_species.csv')

print("Fetching species names CSV...")
species_names_rows = fetch_csv('pokemon_species_names.csv')

print("Fetching evolution CSV...")
evolution_rows = fetch_csv('pokemon_evolution.csv')

print("Fetching items CSV...")
item_names_rows = fetch_csv('item_names.csv')

print("Fetching moves CSV...")
move_names_rows = fetch_csv('move_names.csv')

# Build species Spanish / English name map
species_names = {}
for r in species_names_rows:
    sp_id = int(r['pokemon_species_id'])
    lang_id = int(r['local_language_id'])
    name = r['name']
    if sp_id not in species_names or lang_id == 7: # prefer Spanish
        species_names[sp_id] = name

# Build item Spanish names map
item_names = {
    # Spanish translations override for Cobblemon items
    201: "Revestimiento Metálico",
    221: "Roca del Rey",
    226: "Escama Dragón",
    321: "Protector",
    322: "Electrizador",
    323: "Magmatizador",
    324: "Disco Extraño",
    325: "Tela Terrible",
    326: "Mejora",
    538: "Dulce de Fresa",
    539: "Dulce de Amor",
    540: "Dulce de Baya",
    541: "Dulce de Trébol",
    542: "Dulce de Flor",
    543: "Dulce de Estrella",
    544: "Dulce de Cinta",
    1079: "Cordón Unión"
}

for r in item_names_rows:
    i_id = int(r['item_id'])
    lang_id = int(r['local_language_id'])
    name = r['name']
    if i_id not in item_names and lang_id in (7, 9):
        item_names[i_id] = name

# Build move Spanish names
move_names = {}
for r in move_names_rows:
    m_id = int(r['move_id'])
    lang_id = int(r['local_language_id'])
    name = r['name']
    if m_id not in move_names or lang_id == 7:
        move_names[m_id] = name

# Identify legendaries and mythicals
legendary_ids = set()
mythical_ids = set()

for r in species_rows:
    sp_id = int(r['id'])
    if sp_id <= 1025:
        if r['is_legendary'] == '1':
            legendary_ids.add(sp_id)
        if r['is_mythical'] == '1':
            mythical_ids.add(sp_id)

print(f"Total Legendaries: {len(legendary_ids)}")
print(f"Total Mythicals: {len(mythical_ids)}")

# Cobblemon specialized evolution trigger descriptions
TRIGGER_NAMES = {
    '1': 'Subir nivel',
    '2': 'Cordón Unión / Intercambio',
    '3': 'Usar objeto',
    '4': 'Espacio libre + Poké Ball extra',
    '5': 'Forma Especial (Cobblemon)'
}

evolution_methods = {}

for r in evolution_rows:
    if r['is_default'] == '0' and r['evolved_species_id'] in evolution_methods:
        continue

    sp_id = int(r['evolved_species_id'])
    trig_id = r['evolution_trigger_id']
    parts = []

    item_id = r['trigger_item_id']
    if item_id and int(item_id) in item_names:
        i_name = item_names[int(item_id)]
        parts.append(f"Usar {i_name}")

    min_lvl = r['minimum_level']
    if min_lvl:
        parts.append(f"Nivel {min_lvl}")

    # Trade evolutions adapted to Cobblemon (Link Cable / Cordón Unión or Trade)
    if trig_id == '2':
        held_item = r['held_item_id']
        if held_item and int(held_item) in item_names:
            hi_name = item_names[int(held_item)]
            parts.append(f"Usar {hi_name} / Cordón Unión")
        elif r.get('trade_species_id'):
            ts_id = int(r['trade_species_id'])
            ts_name = species_names.get(ts_id, f"#{ts_id}")
            parts.append(f"Intercambio por {ts_name}")
        else:
            parts.append("Cordón Unión / Intercambio")

    # Happiness
    if r['minimum_happiness']:
        parts.append("Alta Amistad")

    # Affection
    if r['minimum_affection']:
        parts.append("Afecto")

    # Time of day
    tod = r['time_of_day']
    if tod:
        tod_es = "Día" if tod == 'day' else ("Noche" if tod == 'night' else tod)
        parts.append(f"De {tod_es}")

    # Gender
    g_id = r['gender_id']
    if g_id:
        g_str = "Hembra" if g_id == '1' else "Macho"
        parts.append(f"Solo {g_str}")

    # Known move
    m_id = r['known_move_id']
    if m_id and int(m_id) in move_names:
        parts.append(f"Aprender {move_names[int(m_id)]}")

    # Held item non-trade
    held_item = r['held_item_id']
    if held_item and trig_id != '2' and int(held_item) in item_names:
        hi_name = item_names[int(held_item)]
        parts.append(f"Equipado con {hi_name}")

    # Physical stats ratio
    stats = r['relative_physical_stats']
    if stats:
        if stats == '1': parts.append("Ataque > Defensa")
        elif stats == '-1': parts.append("Defensa > Ataque")
        elif stats == '0': parts.append("Ataque = Defensa")

    # Rain
    if r['needs_overworld_rain'] == '1':
        parts.append("Con Lluvia en Minecraft")

    # Upside down
    if r['turn_upside_down'] == '1':
        parts.append("Invertir pantalla / Mirar abajo")

    if not parts:
        if trig_id in TRIGGER_NAMES:
            parts.append(TRIGGER_NAMES[trig_id])
        else:
            parts.append("Condición Especial")

    method_str = " + ".join(parts)
    evolution_methods[sp_id] = method_str

# Group species by evolution_chain_id
chain_species = {}
species_info = {}

for r in species_rows:
    sp_id = int(r['id'])
    if sp_id > 1025:
        continue
    chain_id = int(r['evolution_chain_id']) if r['evolution_chain_id'] else 0
    evolves_from_id = int(r['evolves_from_species_id']) if r['evolves_from_species_id'] else None

    info = {
        'id': sp_id,
        'name': species_names.get(sp_id, f"Pokémon #{sp_id}"),
        'evolvesFromId': evolves_from_id,
        'method': evolution_methods.get(sp_id, None),
        'isLegendary': sp_id in legendary_ids,
        'isMythical': sp_id in mythical_ids
    }

    species_info[sp_id] = info

    if chain_id not in chain_species:
        chain_species[chain_id] = []
    chain_species[chain_id].append(info)

# Build evolution chains for each Pokemon
pokemon_evolution_data = {}

for sp_id, info in species_info.items():
    chain_id = int(next(r['evolution_chain_id'] for r in species_rows if int(r['id']) == sp_id))
    members = chain_species.get(chain_id, [info])
    members_sorted = sorted(members, key=lambda x: x['id'])
    
    pokemon_evolution_data[sp_id] = {
        'chainId': chain_id,
        'chain': members_sorted
    }

with open('src/data/pokemonEvolutions.json', 'w', encoding='utf-8') as f:
    json.dump(pokemon_evolution_data, f, ensure_ascii=False, indent=2)

print("Saved src/data/pokemonEvolutions.json with Cobblemon adaptation!")

# Also output JSON of legendaries and mythicals sets to embed or import in code
legendary_list = sorted(list(legendary_ids))
mythical_list = sorted(list(mythical_ids))

with open('src/data/legendaries.json', 'w', encoding='utf-8') as f:
    json.dump({'legendaries': legendary_list, 'mythicals': mythical_list}, f, indent=2)

print("Saved src/data/legendaries.json successfully!")
