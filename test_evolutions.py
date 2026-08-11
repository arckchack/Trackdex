import urllib.request
import json
import re

ITEM_TRANSLATIONS = {
    "fire-stone": "Piedra Fuego",
    "water-stone": "Piedra Agua",
    "thunder-stone": "Piedra Trueno",
    "leaf-stone": "Piedra Hoja",
    "moon-stone": "Piedra Lunar",
    "sun-stone": "Piedra Solar",
    "shiny-stone": "Piedra Día",
    "dusk-stone": "Piedra Noche",
    "dawn-stone": "Piedra Alba",
    "ice-stone": "Piedra Hielo",
    "oval-stone": "Piedra Oval",
    "king-rock": "Roca del Rey",
    "dragon-scale": "Escama Dragón",
    "deep-sea-tooth": "Diente Marino",
    "deep-sea-scale": "Escama Marina",
    "up-grade": "Mejora",
    "dubious-disc": "Disco Extraño",
    "protector": "Protector",
    "electirizer": "Electrizador",
    "magmarizer": "Magmatizador",
    "reaper-cloth": "Tela Terrible",
    "prism-scale": "Escama Bella",
    "whipped-dream": "Dulce de Nata",
    "sachet": "Saquito Fragante",
    "sweet-apple": "Manzana Dulce",
    "tart-apple": "Manzana Ácida",
    "syrupy-apple": "Manzana Confitada",
    "cracked-pot": "Tetera Agrietada",
    "chipped-pot": "Tetera Desconchada",
    "masterpiece-teacup": "Taza Magistral",
    "unremarkable-teacup": "Taza Exquisita",
    "galarica-cuff": "Brazal Galanuez",
    "galarica-wreath": "Corona Galanuez",
    "auspicious-armor": "Armadura Auspiciosa",
    "malicious-armor": "Armadura Maliciosa",
    "peat-block": "Bloque de Turba",
    "black-augurite": "Mineral Negro",
    "linking-cord": "Cordón Unión",
    "metal-coat": "Revestimiento Metálico",
    "razor-claw": "Garra Afilada",
    "razor-fang": "Colmillo Afilado",
    "sachet": "Saquito Fragante",
    "scroll-of-darkness": "Manto de las Sombras",
    "scroll-of-waters": "Manto de las Aguas"
}

def format_trigger(detail):
    parts = []
    trig = detail.get('trigger', {}).get('name') if detail.get('trigger') else None
    
    if detail.get('item'):
        item_name = detail['item']['name']
        es_item = ITEM_TRANSLATIONS.get(item_name, item_name.replace('-', ' ').title())
        parts.append(f"Usar {es_item}")
    
    if detail.get('min_level'):
        parts.append(f"Nivel {detail['min_level']}")
        
    if trig == 'trade':
        if detail.get('held_item'):
            hi = detail['held_item']['name']
            es_hi = ITEM_TRANSLATIONS.get(hi, hi.replace('-', ' ').title())
            parts.append(f"Intercambio con {es_hi}")
        elif detail.get('trade_species'):
            parts.append(f"Intercambio por {detail['trade_species']['name'].capitalize()}")
        else:
            parts.append("Intercambio")
            
    if detail.get('min_happiness'):
        parts.append("Alta Amistad")
        
    if detail.get('min_affection'):
        parts.append("Afecto")
        
    if detail.get('time_of_day'):
        tod = "Día" if detail['time_of_day'] == 'day' else ("Noche" if detail['time_of_day'] == 'night' else detail['time_of_day'])
        parts.append(f"De {tod}")
        
    if detail.get('gender') is not None:
        g = "Hembra" if detail['gender'] == 1 else "Macho"
        parts.append(f"Solo {g}")
        
    if detail.get('known_move'):
        move_name = detail['known_move']['name'].replace('-', ' ').title()
        parts.append(f"Aprender {move_name}")

    if detail.get('known_move_type'):
        t_name = detail['known_move_type']['name'].capitalize()
        parts.append(f"Conocer movimiento tipo {t_name}")
        
    if detail.get('held_item') and trig != 'trade':
        hi = detail['held_item']['name']
        es_hi = ITEM_TRANSLATIONS.get(hi, hi.replace('-', ' ').title())
        parts.append(f"Equipado con {es_hi}")
        
    if detail.get('location'):
        loc = detail['location']['name'].replace('-', ' ').title()
        parts.append(f"Lugar: {loc}")

    if detail.get('relative_physical_stats') is not None:
        st = detail['relative_physical_stats']
        if st == 1: parts.append("Ataque > Defensa")
        elif st == -1: parts.append("Defensa > Ataque")
        else: parts.append("Ataque = Defensa")

    if detail.get('needs_overworld_rain'):
        parts.append("Con Lluvia")

    if trig == 'shed':
        parts.append("Espacio libre en equipo + Poké Ball extra")

    if trig == 'spin':
        parts.append("Girar al personaje con Dulce equipado")

    if trig == 'three-critical-hits':
        parts.append("Asestar 3 golpes críticos en 1 combate")

    if trig == 'take-damage':
        parts.append("Recibir 49+ PS de daño bajo Puente Esculpido")

    if trig == 'agility':
        parts.append("Dar 1000 pasos en modo Enviar Pokémon")

    if not parts:
        if trig:
            parts.append(trig.replace('-', ' ').title())
        else:
            parts.append("Especial")

    return " + ".join(parts)

req = urllib.request.Request('https://pokeapi.co/api/v2/evolution-chain/1/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print(format_trigger(data['chain']['evolves_to'][0]['evolution_details'][0]))
