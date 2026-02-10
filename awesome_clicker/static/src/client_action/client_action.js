import { registry } from "@web/core/registry";
import { Component} from "@odoo/owl";

import { useClicker } from "../clicker_hook";
import { ClickValue } from "../click_value/click_value";

export class ClickerClientAction extends Component {
    static template = "awesome_clicker.ClientAction";
    static components = { ClickValue };

    setup() {
        this.clicker = useClicker();
    }
}

registry.category("actions").add("awesome_clicker.ClientAction", ClickerClientAction);
