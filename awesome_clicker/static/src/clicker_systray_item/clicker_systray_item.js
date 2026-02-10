import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useExternalListener } from "@odoo/owl";
import { useClicker } from "../clicker_hook";
import { ClickValue } from "../click_value/click_value";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";
    static components = { ClickValue };

    setup() {
        this.clicker = useClicker();
        this.actionService = useService("action");
        useExternalListener(document.body, "click", () => this.clicker.increment(1), { capture: true });
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
