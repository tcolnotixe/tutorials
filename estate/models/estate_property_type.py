from odoo import fields, models


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Lists different types of Estate Properties"

    name = fields.Char(required=True)
    _name_unique = models.Constraint(
        "UNIQUE (name)", "Property type's name must be unique.")
