import { Component, useState } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { PieChart } from "./pie_chart/pie_chart";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem, PieChart };

    setup() {
        this.display = {
            controlPanel: {}
        };

        this.action = useService("action");
        this.statistics = useState(useService("awesome_dashboard.statistics"));
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

registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);
