# server/app/api/cash_flow_routes.py

from flask import Blueprint, request, jsonify
from app.models.cash_box import CashBox
from app.models.movement import Movement
from app.models.denomination import Denomination
from app import db
from datetime import datetime

# Crear un Blueprint para las rutas de flujo de caja
cash_flow_bp = Blueprint('cash_flow_bp', __name__)

def get_or_create_cash_box():
    """Función auxiliar para obtener o crear la única caja de la app."""
    cash_box = CashBox.query.first()
    if not cash_box:
        cash_box = CashBox(total_balance=0.0)
        db.session.add(cash_box)
        # Asegurarnos de que las denominaciones iniciales existan
        denominations = [10, 20, 50, 100, 200, 500, 1000, 2000]
        for value in denominations:
            if not Denomination.query.filter_by(value=value).first():
                new_denomination = Denomination(value=value, quantity=0)
                db.session.add(new_denomination)
        db.session.commit()
    return cash_box

@cash_flow_bp.route('/balance', methods=['GET'])
def get_balance():
    """Obtiene el saldo total de la caja."""
    try:
        cash_box = get_or_create_cash_box()
        return jsonify({'total_balance': cash_box.total_balance})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cash_flow_bp.route('/movement', methods=['POST'])
def add_movement():
    """Añade un movimiento manual (ingreso o gasto)."""
    data = request.get_json()
    if not data or 'amount' not in data or 'type' not in data:
        return jsonify({'error': 'Faltan datos: se requiere monto y tipo'}), 400

    try:
        amount = float(data['amount'])
        movement_type = data['type'] # 'ingreso' o 'gasto'

        if movement_type not in ['ingreso', 'gasto']:
            return jsonify({'error': 'Tipo de movimiento inválido'}), 400
        
        if amount <= 0:
            return jsonify({'error': 'El monto debe ser positivo'}), 400

        cash_box = get_or_create_cash_box()
        
        # Actualizar saldo
        if movement_type == 'ingreso':
            cash_box.total_balance += amount
        else: # gasto
            if cash_box.total_balance < amount:
                return jsonify({'error': 'Saldo insuficiente'}), 400
            cash_box.total_balance -= amount

        # Crear registro del movimiento
        new_movement = Movement(
            amount=amount,
            type=movement_type,
            origin='manual'
        )
        db.session.add(new_movement)
        db.session.commit()

        return jsonify({
            'message': 'Movimiento registrado con éxito',
            'new_balance': cash_box.total_balance
        }), 201
    except ValueError:
        return jsonify({'error': 'Monto inválido'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        
@cash_flow_bp.route('/add_from_scan', methods=['POST'])
def add_from_scan():
    """Añade dinero a la caja desde un billete escaneado."""
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({'error': 'Falta el monto'}), 400

    try:
        amount = int(data['amount'])
        
        cash_box = get_or_create_cash_box()
        denomination = Denomination.query.filter_by(value=amount).first()

        if not denomination:
            return jsonify({'error': f'La denominación de {amount} no es válida'}), 400

        # Actualizar saldo y cantidad de billetes
        cash_box.total_balance += amount
        denomination.quantity += 1
        
        # Crear movimiento
        new_movement = Movement(
            amount=amount,
            type='ingreso',
            origin='escaneo'
        )
        db.session.add(new_movement)
        db.session.commit()
        
        return jsonify({
            'message': f'Billete de ${amount} agregado a la caja',
            'new_balance': cash_box.total_balance
        }), 201

    except ValueError:
        return jsonify({'error': 'Monto inválido'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cash_flow_bp.route('/movements', methods=['GET'])
def get_movements():
    """Obtiene el historial de movimientos."""
    try:
        movements = Movement.query.order_by(Movement.date.desc()).all()
        return jsonify([m.to_dict() for m in movements])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@cash_flow_bp.route('/movements/<int:movement_id>', methods=['PUT'])
def update_movement(movement_id):
    """Modifica un movimiento existente."""
    movement = Movement.query.get_or_404(movement_id)
    data = request.get_json()
    
    if not data or 'amount' not in data:
        return jsonify({'error': 'Falta el nuevo monto'}), 400

    try:
        new_amount = float(data['amount'])
        if new_amount <= 0:
            return jsonify({'error': 'El monto debe ser positivo'}), 400

        cash_box = get_or_create_cash_box()
        
        # Calcular la diferencia para ajustar el saldo total
        old_amount = movement.amount
        
        if movement.type == 'ingreso':
            difference = new_amount - old_amount
        else: # gasto
            difference = old_amount - new_amount

        # Validar que el saldo no quede negativo
        if cash_box.total_balance + difference < 0:
            return jsonify({'error': 'La modificación resulta en saldo negativo'}), 400
            
        # Actualizar saldo y movimiento
        cash_box.total_balance += difference
        movement.amount = new_amount
        movement.date = datetime.utcnow() # Actualizamos la fecha de modificación
        
        db.session.commit()
        
        return jsonify(movement.to_dict())

    except ValueError:
        return jsonify({'error': 'Monto inválido'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cash_flow_bp.route('/denominations', methods=['GET'])
def get_denominations():
    """Obtiene el desglose de billetes."""
    try:
        get_or_create_cash_box() # Asegura que existan las denominaciones
        denominations = Denomination.query.order_by(Denomination.value.asc()).all()
        return jsonify([d.to_dict() for d in denominations])
    except Exception as e:
        return jsonify({'error': str(e)}), 500