import os
import re
import html
import googlemaps
from dotenv import load_dotenv
from datetime import datetime

# === 1. Cargar la API Key de Google ===
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY no está configurada en el archivo .env")

try:
    gmaps = googlemaps.Client(key=API_KEY)
except Exception as e:
    raise ConnectionError(f"❌ Error al conectar con Google Maps API: {e}")

# === 2. Función auxiliar para limpiar y traducir instrucciones ===
def limpiar_instruccion(texto_html):
    """
    Limpia las etiquetas HTML y traduce frases comunes a un español claro y conciso.
    """
    texto = re.sub(r"<[^>]+>", "", texto_html)
    texto = html.unescape(texto)
    
    reemplazos = {
        "Head": "Dirígete",
        "Continue": "Continúa",
        "Turn left": "Gira a la izquierda",
        "Turn right": "Gira a la derecha",
        "Take the": "Toma la",
        "Take": "Toma",
        " towards ": " hacia ",
        " at ": " en ",
        " onto ": " sobre ",
        " destination": " destino",
        " on the right": " a la derecha",
        " on the left": " a la izquierda",
        "Walk": "Camina",
        "walk": "camina"
    }
    
    for eng, esp in reemplazos.items():
        texto = texto.replace(eng, esp)
    
    return texto.strip().capitalize()

# === 3. Determinar si es hora pico ===
def es_hora_pico():
    """
    Determina si es hora pico en CDMX (7-10 AM y 6-9 PM)
    """
    hora_actual = datetime.now().hour
    return (7 <= hora_actual <= 10) or (18 <= hora_actual <= 21)

# === 4. Calcular costo ajustado según hora pico ===
def calcular_costo_transporte(tipo, hora_pico=False):
    """
    Calcula el costo del transporte con ajuste por hora pico
    """
    costos_base = {
        "subway": 5,
        "bus": 6,
        "trolleybus": 7,
        "tram": 7,
        "train": 10,
        "other": 12
    }
    
    costo = costos_base.get(tipo, 12)
    
    # Ajuste por hora pico (puede haber más demanda)
    if hora_pico and tipo in ["subway", "bus"]:
        costo += 1
    
    return costo

# === 5. Función principal de IA experta (MEJORADA) ===
def obtener_rutas_ia(origen, destino):
    """
    Genera rutas de transporte público priorizando opciones económicas,
    con instrucciones claras en español y el costo visible en cada paso.
    """
    
    hora_pico = es_hora_pico()
    
    try:
        # Parámetros de búsqueda
        directions = gmaps.directions(
            origin=origen,
            destination=destino,
            mode="transit",
            alternatives=True,
            region="mx",
            language="es",
            departure_time="now"
        )
        
        rutas = []
        
        # Si no hay rutas de transporte público
        if not directions:
            print("⚠️ No se encontraron rutas públicas")
            taxi_route = {
                "summary": "Ruta en taxi (última opción)",
                "predicted_duration_text": "Depende del tráfico (~15-30 min)",
                "fare_text": "$90.00 MXN (estimado)",
                "transfers": 0,
                "steps": [{
                    "instruction": "Toma un taxi directo hasta tu destino (aprox. $90 MXN)", 
                    "duration": "Variable",
                    "polyline": "",
                    "mode": "DRIVING"
                }],
                "polyline": "",
                "score": 0.1,
                "eco_friendly": False,
                "accessible": True
            }
            return [taxi_route]
        
        print(f"✅ Se encontraron {len(directions)} rutas")
        
        # Procesar cada ruta
        for idx, ruta in enumerate(directions):
            leg = ruta["legs"][0]
            pasos = []
            costo_estimado = 0
            tipos_transporte = []
            distancia_total = leg.get("distance", {}).get("value", 0) / 1000
            
            
            
            # Procesar cada paso
            for step_idx, step in enumerate(leg["steps"]):
                modo = step["travel_mode"]
                instruccion = ""
                
                # Obtener polyline
                polyline = step.get("polyline", {}).get("points", "")
                
                
                
                # 🚇 Transporte público
                if modo == "TRANSIT":
                    detalles = step.get("transit_details", {})
                    linea = detalles.get("line", {})
                    tipo = linea.get("vehicle", {}).get("type", "OTHER").lower()
                    nombre_linea = linea.get("name", "Ruta")
                    nombre_corto = linea.get("short_name", "")
                    direccion = detalles.get("headsign", "dirección desconocida")
                    num_paradas = detalles.get("num_stops", 0)
                    
                    estacion_salida = detalles.get("departure_stop", {}).get("name", "")
                    
                    costo = calcular_costo_transporte(tipo, hora_pico)
                    
                    if tipo == "subway":
                        tipo_txt = "Metro"
                        icono = "🚇"
                    elif tipo == "bus":
                        tipo_txt = "Metrobús"
                        icono = "🚌"
                    elif tipo == "trolleybus":
                        tipo_txt = "Trolebús"
                        icono = "🚎"
                    elif tipo == "tram":
                        tipo_txt = "Tren Ligero"
                        icono = "🚊"
                    elif tipo == "train":
                        tipo_txt = "Tren Suburbano"
                        icono = "🚆"
                    else:
                        tipo_txt = "Transporte público"
                        icono = "🚌"
                    
                    costo_estimado += costo
                    tipos_transporte.append(tipo_txt)
                    
                    nombre_display = f"{nombre_linea}" if not nombre_corto else f"{nombre_linea} ({nombre_corto})"
                    instruccion = f"{icono} Toma el {tipo_txt} {nombre_display} con dirección {direccion}"
                    
                    if estacion_salida:
                        instruccion += f" desde {estacion_salida}"
                    
                    if num_paradas > 0:
                        instruccion += f" ({num_paradas} paradas)"
                    
                    instruccion += f" - Costo: ${costo} MXN"
                    
                    pasos.append({
                        "instruction": instruccion,
                        "duration": step["duration"]["text"],
                        "polyline": polyline,
                        "mode": "TRANSIT",
                        "transit_type": tipo
                    })
                
                # 🚶 Caminata
                elif modo == "WALKING":
                    distancia = step.get("distance", {}).get("text", "")
                    instruccion = limpiar_instruccion(step.get("html_instructions", "Camina hacia tu destino."))
                    
                    if distancia:
                        instruccion = f"🚶 {instruccion} ({distancia})"
                    else:
                        instruccion = f"🚶 {instruccion}"
                    
                    pasos.append({
                        "instruction": instruccion,
                        "duration": step["duration"]["text"],
                        "polyline": polyline,
                        "mode": "WALKING"
                    })
                
                # 🚖 Taxi
                elif modo == "DRIVING":
                    instruccion = "🚖 Toma un taxi o servicio de transporte directo hasta tu destino (Costo aprox. $90 MXN)"
                    costo_estimado += 90
                    tipos_transporte.append("Taxi")
                    
                    pasos.append({
                        "instruction": instruccion,
                        "duration": step["duration"]["text"],
                        "polyline": polyline,
                        "mode": "DRIVING"
                    })
                
                else:
                    instruccion = limpiar_instruccion(step.get("html_instructions", ""))
                    
                    pasos.append({
                        "instruction": instruccion,
                        "duration": step["duration"]["text"],
                        "polyline": polyline,
                        "mode": modo
                    })
            
            
            
            # Calcular índice de conveniencia
            duracion_min = leg["duration"]["value"] / 60
            transbordos = len(tipos_transporte) - 1 if len(tipos_transporte) > 0 else 0
            costo_normalizado = min(costo_estimado / 20, 1)
            factor_distancia = min(distancia_total / 20, 1)
            factor_hora_pico = 0.9 if hora_pico else 1.0
            
            conveniencia = max(0.1, 
                (1 - (duracion_min / 120)) * 0.4 +
                (1 - (transbordos * 0.1)) * 0.3 +
                (1 - costo_normalizado) * 0.2 +
                (1 - factor_distancia) * 0.1
            ) * factor_hora_pico
            
            eco_friendly = len([t for t in tipos_transporte if t != "Taxi"]) >= len(tipos_transporte) * 0.8 if tipos_transporte else False
            
            inicio_simple = leg['start_address'].split(',')[0]
            fin_simple = leg['end_address'].split(',')[0]
            
            # 🔴 CRÍTICO: Asegurar que steps se incluya en la respuesta
            ruta_data = {
                "summary": f"{inicio_simple} → {fin_simple}",
                "predicted_duration_text": leg["duration"]["text"],
                "fare_text": f"${costo_estimado:.2f} MXN",
                "transfers": transbordos,
                "steps": pasos,  # 🔴 AQUÍ ESTÁN LOS PASOS
                "polyline": ruta["overview_polyline"]["points"],
                "score": round(conveniencia, 2),
                "distance": f"{distancia_total:.1f} km",
                "eco_friendly": eco_friendly,
                "accessible": transbordos <= 2,
                "rush_hour": hora_pico
            }
            
            
            
            rutas.append(ruta_data)
        
        # Ordenar rutas
        rutas.sort(key=lambda r: r["score"], reverse=True)
        
        # Agregar etiqueta a la mejor
        if rutas:
            rutas[0]["summary"] += " ⭐"
            if rutas[0].get("eco_friendly"):
                rutas[0]["summary"] += " 🌱"
        
       
        
        return rutas
        
    except googlemaps.exceptions.ApiError as api_err:
        print(f"❌ Error de Google Maps API: {api_err}")
        return [{
            "summary": "Error al consultar Google Maps",
            "fare_text": "$0.00 MXN",
            "predicted_duration_text": "N/A",
            "transfers": 0,
            "steps": [{
                "instruction": "Error: Verifica tu API Key de Google Maps", 
                "duration": "N/A",
                "polyline": "",
                "mode": "ERROR"
            }],
            "polyline": "",
            "score": 0,
            "distance": "N/A",
            "eco_friendly": False,
            "accessible": False
        }]
        
    except Exception as e:
        print(f"❌ Error interno IA: {e}")
        import traceback
        traceback.print_exc()
        return [{
            "summary": "Error al obtener rutas",
            "fare_text": "$0.00 MXN",
            "predicted_duration_text": "N/A",
            "transfers": 0,
            "steps": [{
                "instruction": "Error interno del servidor. Intenta de nuevo.", 
                "duration": "N/A",
                "polyline": "",
                "mode": "ERROR"
            }],
            "polyline": "",
            "score": 0,
            "distance": "N/A",
            "eco_friendly": False,
            "accessible": False
        }]