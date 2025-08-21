import os
import sys

# Añadir el directorio 'server' al path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)