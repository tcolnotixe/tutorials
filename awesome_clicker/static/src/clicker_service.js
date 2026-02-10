import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const clickBotPrice = 1000;
const firstMilestoneTarget = 1000;

const clicker_service = {
    start() {
        const state = reactive({
            clicks: 0,
            level: 0,
            clickBots: 0,
        });

        setInterval(() => {
            state.clicks += state.clickBots * 10
        }, 10000);

        function increment(inc) {
            state.clicks += inc;

            if (state.level < 1 && state.clicks >= firstMilestoneTarget) {
                state.level++;
            }
        }

        function buyClickBot() {
            if (state.clicks < clickBotPrice) {
                return false;
            }

            state.clicks -= clickBotPrice;
            state.clickBots++;
        }

        return {
            state,
            increment,
            buyClickBot
        };
    },
};

registry.category("services").add("awesome_clicker.clicker_service", clicker_service);
