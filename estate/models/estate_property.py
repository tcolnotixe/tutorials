from dateutil.relativedelta import relativedelta

from odoo import fields, models


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real estate property"

    name = fields.Char(string="Title", required=True)
    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(string="Available From", copy=False,
                                    default=lambda self: self._default_date_availability())
    expected_price = fields.Float(required=True)
    selling_price = fields.Float(readonly=True, copy=False)
    bedrooms = fields.Integer(default="2")
    living_area = fields.Integer()
    facades = fields.Integer()
    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer()
    garden_orientation = fields.Selection([
        ('north', 'North'),
        ('south', 'South'),
        ('east', 'East'),
        ('west', 'West')
    ])
    active = fields.Boolean(copy=False, default=True)
    state = fields.Selection([
        ('new', 'New'),
        ('received', 'Offer Received'),
        ('accepted', 'Offer Accepted'),
        ('sold', 'Sold'),
        ('cancelled', 'Cancelled')
    ], default='new', copy=False)

    # Many2one
    property_type_id = fields.Many2one(
        "estate.property.type", string="Property Type")
    buyer_id = fields.Many2one(
        "res.partner", string="Buyer", copy=False
    )
    salesperson_id = fields.Many2one(
        "res.users", string="Salesman", default=lambda self: self._default_salesperson_id()
    )

    # Many2many
    tag_ids = fields.Many2many(
        "estate.property.tag", string="Tags"
    )

    # One2many
    offer_ids = fields.One2many(
        "estate.property.offer", "property_id", string="Offers")

    # ------------------------------------------- Defaults ----------------------------------------
    def _default_date_availability(self):
        return fields.Date.context_today(self) + relativedelta(months=3)

    def _default_salesperson_id(self):
        return self.env.user
