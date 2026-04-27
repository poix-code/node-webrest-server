import { TodoEntity } from "../../../domain";

describe('Should test Todo entity and its methods', () => {
    
    const todoStub = {
        id: 1,
        text: 'Test todo',
        completedAt: new Date()
    };

    test('should create a new Todo instance with valid data', () => {

        const todo = new TodoEntity(todoStub.id, todoStub.text, todoStub.completedAt);
        expect(todo).toBeInstanceOf(TodoEntity);
        expect(todo.id).toBe(todoStub.id);
        expect(todo.text).toBe(todoStub.text);
    });

    test('Method isCompleted should return true when completedAt is set', () => {

        const todo = new TodoEntity(todoStub.id, todoStub.text, todoStub.completedAt);
        expect(todo.isCompleted).toBe(true);
    });

    test('Method isCompleted should return false when completedAt is null', () => {

        const todo = new TodoEntity(todoStub.id, todoStub.text, null);
        expect(todo.isCompleted).toBe(false);
    });

    test('Method fromObject should create a new Todo instance from a plain object', () => {

        const todo = TodoEntity.fromObject(todoStub);
        expect(todo).toBeInstanceOf(TodoEntity);
        expect(todo.id).toBe(todoStub.id);
    });

    test('Method fromObject should throw an error if id is missing', () => {

        const invalidTodoStub = { ...todoStub, id: undefined };
        expect(() => TodoEntity.fromObject(invalidTodoStub)).toThrow("Id is required");
    });

    test('Method fromObject should throw an error if text is missing', () => {

        const invalidTodoStub = { ...todoStub, text: undefined };
        expect(() => TodoEntity.fromObject(invalidTodoStub)).toThrow("Text is required");
    });

    test('Method fromObject should throw an error if text is not a string', () => {

        const invalidTodoStub = { ...todoStub, text: 123 };
        expect(() => TodoEntity.fromObject(invalidTodoStub)).toThrow("Text is required");
    });

    test('Method fromObject should throw an error if completedAt is not a valid date', () => {

        const invalidTodoStub = { ...todoStub, completedAt: 'invalid-date' };
        expect(() => TodoEntity.fromObject(invalidTodoStub)).toThrow('CompletedAt is not a valid date');
    });
});