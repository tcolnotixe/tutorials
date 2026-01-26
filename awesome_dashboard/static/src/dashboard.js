import { Component, onWillStart } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { rpc } from "@web/core/network/rpc";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };

    setup() {
        this.display = {
            controlPanel: {}
        };

        this.action = useService("action");

        onWillStart(async () => {
            this.statistics = await rpc("/awesome_dashboard/statistics");
        });
    }

    openCustomersView() {
        this.action.doAction("base.action_partner_form");
    }

    openLeadsView() {
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: 'Leads',
            target: 'current',
            res_model: 'crm.lead',
            views: [
                [false, 'list'],
                [false, 'form']
            ]
        });
    }
}

registry.category("actions").add("awesome_dashboard.dashboard", AwesomeDashboard);
