import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const clicker_service = {
    start() {
        const state = reactive({ clicks: 0 });

        return {
            state,
            increment(inc) {
                state.clicks += inc
            }
        };
    },
};

registry.category("services").add("awesome_clicker.clicker_service", clicker_service);
