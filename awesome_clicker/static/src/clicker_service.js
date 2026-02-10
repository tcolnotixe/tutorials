import { registry } from "@web/core/registry";
import { Clicker } from "./clicker_model";

const clicker_service = {
    start() {
        return new Clicker();
    },
};

registry.category("services").add("awesome_clicker.clicker_service", clicker_service);
