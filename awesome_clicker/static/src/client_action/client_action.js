import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";

export class ClickerClientAction extends Component {
    static template = "awesome_clicker.ClientAction";
}

registry.category("actions").add("awesome_clicker.ClientAction", ClickerClientAction);
