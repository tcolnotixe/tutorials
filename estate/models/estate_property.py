from dateutil.relativedelta import relativedelta

from odoo import api, fields, models
from odoo.exceptions import UserError, ValidationError
from odoo.tools.float_utils import float_compare, float_is_zero


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real estate property"
    _order = "id desc"

    name = fields.Char(string="Title", required=True)
    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(string="Available From", copy=False,
                                    default=lambda self: self._default_date_availability())
    expected_price = fields.Float(required=True)
    _check_expected_price = models.Constraint(
        'CHECK(expected_price > 0)',
        'Expected price must be stricly positive.'
    )
    selling_price = fields.Float(readonly=True, copy=False)
    _check_selling_price = models.Constraint(
        'CHECK(selling_price >= 0)',
        'Expected price must be positive.'
    )
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
    ], default='new', copy=False, string="Status")
    total_area = fields.Integer(compute="_compute_total_area")
    best_price = fields.Float(
        compute="_compute_best_price", string="Best Offer")

    # Many2one
    property_type_id = fields.Many2one(
        "estate.property.type", string="Property Type")
    buyer_id = fields.Many2one(
        "res.partner", string="Buyer", copy=False, readonly=True
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

    # ------------------------------------------- Computed ----------------------------------------
    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            record.total_area = record.living_area + record.garden_area

    @api.depends("offer_ids.price")
    def _compute_best_price(self):
        for record in self:
            record.best_price = max(
                record.offer_ids.mapped("price"), default=0)

    # ------------------------------------------- Onchange ----------------------------------------
    @api.onchange("garden")
    def _onchange_garden(self):
        self.garden_area = self.garden and 10
        self.garden_orientation = self.garden and "north"

    # ------------------------------------------- Actions -----------------------------------------
    def action_sold(self):
        for record in self:
            if self.state == "cancelled":
                raise UserError("A cancelled property cannot be sold.")
            self.state = "sold"
        return True

    def action_cancel(self):
        for record in self:
            if self.state == "sold":
                raise UserError("A sold property cannot be cancelled.")
            self.state = "cancelled"
        return True

    def _action_accept_offer(self, offer):
        for record in self:
            if len(record.offer_ids.filtered(lambda o: o.status == "accepted")) > 0:
                raise UserError(
                    "Only one offer can be accepted.")

            record.selling_price = offer.price
            record.buyer_id = offer.partner_id
        return True

    # ---------------------------------------- Constraints ----------------------------------------
    @api.constrains("selling_price", "expected_price")
    def _check_selling_price(self):
        for record in self:
            if float_is_zero(record.selling_price, 2):
                continue

            if float_compare(record.selling_price, 0.9 * record.expected_price, 2) < 0:
                raise ValidationError(
                    "The selling price must be higher than 90% of the expected price. You must reduce the expected price to accept this offer.")

    # ------------------------------------------- CRUD --------------------------------------------
    @api.ondelete(at_uninstall=False)
    def _unlink_if_new_or_cancelled(self):
        if any(estate_property.state not in ('new', 'cancelled') for estate_property in self):
            raise UserError("Only New or Cancelled Properties can be deleted.")
