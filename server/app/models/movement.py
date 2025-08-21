from .. import db
from datetime import datetime

class Movement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    movement_type = db.Column(db.String(50), nullable=False)  # "ingreso" o "gasto"
    origin = db.Column(db.String(50), nullable=False) # "manual" o "escaneo"
    cash_box_id = db.Column(db.Integer, db.ForeignKey('cash_box.id'), nullable=False)