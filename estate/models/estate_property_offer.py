from odoo import fields, models


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "A property offer is an amount a potential buyer offers to the seller. The offer can be lower or higher than the expected price."

    price = fields.Float()
    status = fields.Selection(
        selection=[("accepted", "Accepted"), ("refused", "Refused")], copy=False)

    partner_id = fields.Many2one(
        "res.partner", string="Partner", required=True)
    property_id = fields.Many2one(
        "estate.property", string="Property", required=True)
