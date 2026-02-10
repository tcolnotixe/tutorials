import { registry } from "@web/core/registry";
import { Component} from "@odoo/owl";

import { useClicker } from "../clicker_hook";

export class ClickerClientAction extends Component {
    static template = "awesome_clicker.ClientAction";

    setup() {
        this.clicker = useClicker();
    }
}

registry.category("actions").add("awesome_clicker.ClientAction", ClickerClientAction);
