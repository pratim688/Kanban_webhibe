import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task, TaskState } from "../types"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities"

interface Props {
    task: Task;
    deleteTask: (id:Id) => void
    updateTask: (id:Id, content:string) => void
}

const TaskCard = ( {task, deleteTask, updateTask}:Props ) => {

    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [state,setState] = useState("Pending");
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data:{ type: "Task", task },
        disabled: editMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };
    
    const toggleEditMode = () => {
        setEditMode((prev)=> !prev)
    }

    if(isDragging) {
        return <div ref={setNodeRef} style={style}
        className="bg-mainBackgroundColor opacity-30 p-2.5 h-[100px]
        min-h-[100px] items-center flex flex-left rounded-xl border-2
        border-rose-500 cursor-grab relative"/>
    }

    if (editMode) {
        return (
            <div {...attributes} {...listeners}
            ref={setNodeRef} style={style}
            className="bg-mainBackgroundColor p-2.5 h-[100px]
            min-h-[100px] items-center flex flex-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grab relative task">
                <textarea className="h-[90%] w-full resize-none border-none rounded
                bg-transparent text-white focus:outline-none"
                value={task.content} autoFocus
                placeholder="Task content here"
                onBlur={toggleEditMode}
                onKeyDown={(e)=>{
                    if(e.shiftKey && e.key == "Enter") toggleEditMode();
                }}
                onChange={(e)=>updateTask(task.id, e.target.value)}
                ></textarea>
        </div>
        )
    }

    const updateTaskState = (id: Id, newState: TaskState) => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            const updatedTasks = tasks.map((t: Task) => 
                t.id === id ? { ...t, state: newState } : t
            );
            setState(newState)
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        }
        
    };
  return (
    <div onClick={toggleEditMode}
        onMouseEnter={()=>{setMouseIsOver(true)}}
        onMouseLeave={()=>{setMouseIsOver(false)}}
        {...attributes} {...listeners}
        ref={setNodeRef} style={style}
        className="bg-mainBackgroundColor p-2.5 h-[100px]
        min-h-[100px] items-center flex flex-left rounded-xl
        hover:ring-2 hover:ring-inset hover:ring-rose-500
        cursor-grab relative">
        <p className="my-auto h-[90%] w-full overflow-y-auto
        overflow-x-hidden whitespace-pre-wrap">
            {" "}{task.content}
        </p>
        <select 
            value={state}
            onChange={(e) => updateTaskState(task.id, e.target.value as TaskState)}
            onClick={(e) => e.stopPropagation()} // Prevent edit mode toggle
            className="absolute right-4 top-2 bg-columnBackgroundColor text-white 
            rounded p-1 text-sm outline-none border border-rose-500"
        >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
        </select>
        { mouseIsOver && (
                    <button onClick={()=>{deleteTask(task.id)}}
                    className="stroke-white absolute right-4 top-2/3
                    -translate-y-1/2 bg-columnBackgroundColor p-2 rounded">
                        <TrashIcon/>
                    </button>
        )}

    </div>
  )
}

export default TaskCard