export type Id = string | number;

export type Column ={
    id: Id;
    title: string;
}

export type TaskState = "Pending" | "In Progress" | "Done";

export type Task = {
    id: Id;
    columnId: Id;
    content: string;
    state: TaskState;
}