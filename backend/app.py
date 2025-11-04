from flask import Flask, request, jsonify
from flask_cors import CORS
from ia_model import obtener_rutas_ia
import logging
from dotenv import load_dotenv
import time

# Cargar variables del entorno
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración de logging mejorada
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/api/v1/ruta_transporte', methods=['POST'])
def obtener_ruta_transporte():
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        # Validación mejorada
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
            
        origen = data.get('origen')
        destino = data.get('destino')
        
        if not origen or not destino:
            return jsonify({'error': 'Faltan parámetros: origen o destino'}), 400
        
        # Validación de longitud
        if len(origen) < 3 or len(destino) < 3:
            return jsonify({'error': 'Origen y destino deben tener al menos 3 caracteres'}), 400
        
        logger.info(f"🧭 Buscando rutas entre: {origen} → {destino}")
        
        # Llamada a la IA
        rutas = obtener_rutas_ia(origen, destino)
        
        elapsed_time = time.time() - start_time
        logger.info(f"✅ Rutas encontradas en {elapsed_time:.2f} segundos")
        
        # Agregar metadata de respuesta
        response = {
            'rutas': rutas,
            'metadata': {
                'tiempo_procesamiento': f"{elapsed_time:.2f}s",
                'total_rutas': len(rutas),
                'timestamp': time.time()
            }
        }
        
        return jsonify(rutas), 200
        
    except ValueError as ve:
        logger.error(f"❌ Error de validación: {ve}")
        return jsonify({'error': f'Error de validación: {str(ve)}'}), 400
        
    except ConnectionError as ce:
        logger.error(f"❌ Error de conexión con Google Maps API: {ce}")
        return jsonify({'error': 'Error de conexión con el servicio de mapas. Intenta de nuevo.'}), 503
        
    except Exception as e:
        logger.error(f"❌ Error interno en /api/v1/ruta_transporte: {e}", exc_info=True)
        return jsonify({'error': 'Error interno del servidor. Por favor intenta de nuevo.'}), 500

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend funcionando correctamente',
        'timestamp': time.time()
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    logger.info("🚀 Iniciando servidor Flask en puerto 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)