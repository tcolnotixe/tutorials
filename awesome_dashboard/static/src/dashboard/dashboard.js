import { Component, useState } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { Dialog } from "@web/core/dialog/dialog";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { browser } from "@web/core/browser/browser";


class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };

    setup() {
        this.items = registry.category("awesome_dashboard").getAll();

        this.display = {
            controlPanel: {}
        };

        this.action = useService("action");
        this.dialog = useService("dialog");
        this.statistics = useState(useService("awesome_dashboard.statistics"));
        this.state = useState({ disabledItems: localStorage.getItem("disabledDashboardItems")?.split(',') || [] });
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

    openConfiguration() {
        this.dialog.add(ConfigurationDialog, {
            items: this.items,
            disabledItems: this.state.disabledItems,
            onApplyConfiguration: this.applyConfiguration.bind(this)
        });
    }

    applyConfiguration(newConfiguration) {
        this.state.disabledItems = newConfiguration;
    }
}

class ConfigurationDialog extends Component {
    static template = "awesome_dashboard.ConfigurationDialog";
    static components = { Dialog, CheckBox };
    static props = {
        items: Object,
        close: Function,
        disabledItems: Array,
        onApplyConfiguration: Function
    };

    setup() {
        this.items = useState(this.props.items.map((item) => {
            return {
                ...item,
                enabled: !this.props.disabledItems.includes(item.id)
            }
        }));
    }

    applyConfiguration() {
        const disabledItemIds = this.items
            .filter((item) => !item.enabled)
            .map((item) => item.id);

        browser.localStorage.setItem("disabledDashboardItems", disabledItemIds);

        this.props.onApplyConfiguration(disabledItemIds);

        this.props.close();
    }

    onCheckboxChange (value, item) {
        console.log(value);
        item.enabled = value;
    }
}

registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);
