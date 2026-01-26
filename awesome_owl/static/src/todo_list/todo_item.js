import { Component } from "@odoo/owl";

const TodoShape = {
    id: Number,
    description: String,
    isCompleted: Boolean
}

export class TodoItem extends Component {
    static template = "awesome_owl.todo_item";
    static props = {
        todo: {
            type: Object,
            shape: TodoShape
        },
        toggleState: Function
    };

    onToggled() {
        this.props.toggleState(this.props.todo.id);
    }
}
