from dateutil.relativedelta import relativedelta

from odoo import api, fields, models


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "A property offer is an amount a potential buyer offers to the seller. The offer can be lower or higher than the expected price."

    price = fields.Float()
    _check_price = models.Constraint(
        'CHECK(price > 0)',
        'Offer price must be stricly positive.'
    )
    status = fields.Selection(
        selection=[("accepted", "Accepted"), ("refused", "Refused")], copy=False)
    validity = fields.Integer(string="Validity (days)", default=7)
    date_deadline = fields.Date(
        string="Deadline", compute="_compute_date_deadline", inverse="_inverse_date_deadline")

    # Many2one
    partner_id = fields.Many2one(
        "res.partner", string="Partner", required=True)
    property_id = fields.Many2one(
        "estate.property", string="Property", required=True)

    # ------------------------------------------- Computed ----------------------------------------
    @api.depends("create_date", "validity")
    def _compute_date_deadline(self):
        for record in self:
            if not record.create_date or not record.validity:
                continue

            record.date_deadline = record.create_date + \
                relativedelta(days=record.validity)

    def _inverse_date_deadline(self):
        for record in self:
            delta = relativedelta(record.date_deadline, record.create_date)
            record.validity = delta.days

    # ------------------------------------------- Actions -----------------------------------------
    def action_accept(self):
        for record in self:
            record.property_id._action_accept_offer(self)
            record.status = "accepted"
        return True

    def action_refuse(self):
        for record in self:
            record.status = "refused"
        return True
