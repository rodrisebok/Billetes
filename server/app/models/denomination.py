from .. import db

class Denomination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False, unique=True) # 10, 20, 50, 100, 200, 500, 1000, 2000
    count = db.Column(db.Integer, nullable=False, default=0)
    cash_box_id = db.Column(db.Integer, db.ForeignKey('cash_box.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'value': self.value,
            'quantity': self.count  # Mapear count -> quantity para la API
        }