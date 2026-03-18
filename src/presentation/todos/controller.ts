import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {

    //* DI
    constructor() {

    }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        if(!todos) return res.status(404).json({ error: "No todos found" });
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
        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({ error: error });


        const todo = await prisma.todo.create({
            data: createTodoDto!
        });
        res.json(todo);
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

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `TODO with id ${id} not found` });
        
        //! Ojo, se pasa por referencia
        // todo.text = text || todo.text;
        // ( completedAt === null)
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date(completedAt || todo.completedAt);

        const updatedTodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: updateTodoDto!.values
        });
        if(!updatedTodo) return res.status(404).json({ error: `TODO with id ${id} not found` });

        res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const idParam = req.params.id;
        if(!idParam) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });
        const id = +idParam;
        if(isNaN(id)) return res.status(400).json({ error: "Invalid or missing 'id' parameter" });

        // const todo = todos.find(todo => todo.id === id);
        // if(!todo) return res.status(400).json(`TODO with id ${id} not found`);

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `TODO with id ${id} not found` });

        // todos.splice(todos.indexOf(todo), 1);
        const deletedTodo = await prisma.todo.delete({
            where: {
                id: id
            }
        });
        (deletedTodo)
            ? res.json(deletedTodo)
            : res.status(400).json({ error: `TODO with id ${id} not found` });
    }
}