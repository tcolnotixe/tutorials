from odoo import fields, models


class EstatePropertyTag(models.Model):
    _name = "estate.property.tag"
    _description = "Additionnal data tag about a property. For example: 'cosy' or 'renovated'"
    _order = "name"

    name = fields.Char(required=True)
    _name_unique = models.Constraint(
        "UNIQUE (name)", "Property tag's name must be unique.")
    color = fields.Integer()
