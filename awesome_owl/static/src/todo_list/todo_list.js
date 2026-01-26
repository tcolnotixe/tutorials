import { Component, useState} from "@odoo/owl";
import { TodoItem } from "./todo_item";
import { useAutofocus } from "../utils";

export class TodoList extends Component {
    static template = "awesome_owl.todo_list";
    static components = { TodoItem };

    setup() {
        this.next_id = 1;
        this.todos = useState([]);
        useAutofocus("new_task_input");
    }

    addTodo (ev) {
        if (ev.keyCode === 13 && ev.target.value != "") {
            this.todos.push({
                id: this.next_id,
                description: ev.target.value,
                isCompleted: false
            });
            ev.target.value = "";
            this.next_id++;
        }
    }

    toggleState(todoId) {
        const todo = this.todos.find(todo => todo.id === todoId);
        if (todo) {
            todo.isCompleted = !todo.isCompleted;
        }
    }

}
