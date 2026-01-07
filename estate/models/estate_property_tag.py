from odoo import fields, models


class EstatePropertyTag(models.Model):
    _name = "estate.property.tag"
    _description = "Additionnal data tag about a property. For example: 'cosy' or 'renovated'"

    name = fields.Char(required=True)
