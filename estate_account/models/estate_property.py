from odoo import models, Command


class EstateProperty(models.Model):
    _name = "estate.property"
    _inherit = "estate.property"

    def action_sold(self):
        self._create_invoices()
        return super().action_sold()

    def _create_invoices(self):
        invoice_vals_list = []

        for record in self:
            invoice_vals = record._prepare_invoice()
            invoice_lines_vals = [
                # 6% of selling price
                {
                    'name': f'{record.name} (6% of selling price)',
                    'quantity': 1,
                    'price_unit': 0.06 * record.selling_price
                },
                # Administrative fee
                {
                    'name': 'Administrative fees',
                    'quantity': 1,
                    'price_unit': 100
                }
            ]

            invoice_vals['invoice_line_ids'] = [Command.create(
                invoice_line) for invoice_line in invoice_lines_vals]

            invoice_vals_list.append(invoice_vals)

        moves = self.env["account.move"].sudo().with_context(
            default_move_type="out_invoice").create(invoice_vals_list)

        return moves

    def _prepare_invoice(self):
        """
        Prepare the dict of values to create the new invoice for a sold estate property.
        """
        self.ensure_one()

        invoice_vals = {
            'move_type': 'out_invoice',
            'partner_id': self.buyer_id.id
        }
        return invoice_vals
