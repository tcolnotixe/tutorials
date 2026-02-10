import { Reactive } from "@web/core/utils/reactive";

export class Clicker extends Reactive {

    static clickBotPrice = 1000;
    static firstMilestoneTarget = 1000;

    constructor() {
        super();

        this.clicks = 998;
        this.level = 1;
        this.clickBots = 0;

        document.addEventListener("click", () => this.increment(1), { capture: true });

        setInterval(() => {
            this.clicks += this.clickBots * 10
        }, 1000);
    }

    increment(inc) {
        this.clicks += inc;

        if (this.level < 1 && this.clicks >= Clicker.firstMilestoneTarget) {
            this.level++;
        }
    }

    buyClickBot() {
        if (this.clicks < Clicker.clickBotPrice) {
            return false;
        }

        this.clicks -= Clicker.clickBotPrice;
        this.clickBots++;
    }
}