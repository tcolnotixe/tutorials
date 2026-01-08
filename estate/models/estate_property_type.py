from odoo import api, fields, models


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Lists different types of Estate Properties"
    _order = "sequence, name"

    name = fields.Char(required=True)
    _name_unique = models.Constraint(
        "UNIQUE (name)", "Property type's name must be unique.")
    sequence = fields.Integer()
    offer_count = fields.Integer(compute="_compute_offer_count")

    property_ids = fields.One2many(
        "estate.property", "property_type_id", string="Properties")
    offer_ids = fields.One2many(
        "estate.property.offer", "property_type_id", string="Offers")

    @api.depends("offer_ids")
    def _compute_offer_count(self):
        for record in self:
            record.offer_count = (
                record.offer_ids and len(record.offer_ids)) or 0
