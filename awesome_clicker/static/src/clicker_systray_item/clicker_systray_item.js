import { registry } from "@web/core/registry";
import { Component, useState, useExternalListener } from "@odoo/owl";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";

    setup() {
        this.state = useState({counter: 0});
        useExternalListener(document.body, "click", () => this.increment(1), { capture: true });
    }

    increment(value) {
        this.state.counter += value;
    }
}

const clickerSystrayItem = {
    Component: ClickerSystray
};

registry.category("systray").add("awesome_clicker.ClickerSystrayItem", clickerSystrayItem);
