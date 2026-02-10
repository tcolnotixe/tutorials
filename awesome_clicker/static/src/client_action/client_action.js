import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState } from "@odoo/owl";

export class ClickerClientAction extends Component {
    static template = "awesome_clicker.ClientAction";

    setup() {
        this.clickerService = useService("awesome_clicker.clicker_service");
        this.state = useState(this.clickerService.state);
    }

    increment() {
        this.clickerService.increment(9);
    }
}

registry.category("actions").add("awesome_clicker.ClientAction", ClickerClientAction);
