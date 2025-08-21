from .. import db

class CashBox(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)

    movements = db.relationship('Movement', backref='cash_box', lazy=True, cascade="all, delete-orphan")
    denominations = db.relationship('Denomination', backref='cash_box', lazy=True, cascade="all, delete-orphan")