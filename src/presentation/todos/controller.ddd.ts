import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    public getTodos = async (req: Request, res: Response) => {

        const todos = await this.todoRepository.getAll();
        console.log(todos);
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const idParam = req.params.id;
        if(!idParam) {
            return res.status(400).json({ error: "Invalid or missing 'id' parameter" });
        }
        const id = +idParam;
        if(isNaN(id)) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });

        // const todo = todos.find(todo => todo.id === id);
        
        // ( todo )
        //     ? res.json(todo)
        //     : res.status(404).json({ error: `TODO with id ${id} not found` });
        try {
            const todo = await this.todoRepository.findById(id);
            return res.json(todo);
        } catch(error) {
            res.status(404).json({ error });
        }

    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({ error: error });

        const todo = await this.todoRepository.create(createTodoDto!);
        return res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const idParm = req.params.id;
        if(!idParm) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });
        const id = +idParm;
        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body, id
        });
        if(error) return res.status(400).json({ error: error });

        // const todo = todos.find(todo => todo.id === id);
        // if (!todo) return res.status(404).json({ error: `TODO with id ${id} not found` });        
        //! Ojo, se pasa por referencia
        // todo.text = text || todo.text;
        // ( completedAt === null)
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date(completedAt || todo.completedAt);

        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
        return res.json(updatedTodo);

    }

    public deleteTodo = async (req: Request, res: Response) => {
        const idParam = req.params.id;
        if(!idParam) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });
        const id = +idParam;
        if(isNaN(id)) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });

        // const todo = todos.find(todo => todo.id === id);
        // if(!todo) return res.status(400).json(`TODO with id ${id} not found`);
        // todos.splice(todos.indexOf(todo), 1);

        const deletedTodo = await this.todoRepository.deleteById(id);
        return res.json(deletedTodo);

    }
}