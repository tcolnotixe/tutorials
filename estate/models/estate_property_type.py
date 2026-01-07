from odoo import fields, models


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Lists different types of Estate Properties"

    name = fields.Char(required=True)
