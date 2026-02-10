import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, useExternalListener } from "@odoo/owl";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";

    setup() {
        this.state = useState({counter: 0});
        this.actionService = useService("action");
        useExternalListener(document.body, "click", () => this.increment(1), { capture: true });
    }

    open() {
        this.increment(9);
        this.actionService.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.ClientAction",
            target: "new",
            name: "Clicker Game"
        });
    }

    increment(value) {
        this.state.counter += value;
    }
}

const clickerSystrayItem = {
    Component: ClickerSystray
};

registry.category("systray").add("awesome_clicker.ClickerSystrayItem", clickerSystrayItem);
