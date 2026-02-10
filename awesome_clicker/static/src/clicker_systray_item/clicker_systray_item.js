import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, useExternalListener } from "@odoo/owl";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";

    setup() {
        this.clickerService = useService("awesome_clicker.clicker_service");
        this.state = useState(this.clickerService.state);
        this.actionService = useService("action");
        useExternalListener(document.body, "click", () => this.clickerService.increment(1), { capture: true });
    }

    open() {
        this.actionService.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.ClientAction",
            target: "new",
            name: "Clicker Game"
        });
    }    
}

const clickerSystrayItem = {
    Component: ClickerSystray
};

registry.category("systray").add("awesome_clicker.ClickerSystrayItem", clickerSystrayItem);
