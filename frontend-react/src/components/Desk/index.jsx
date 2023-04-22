import React, { useState } from "react";

import { apiService } from "../../shared/api/swagger/swagger";

import { Button, Task, CreateTaskPopup, EditTaskPopup } from "../../components";

const Desk = ({ statusId, statusTitle, tasks, updateTasks, users }) => {
    let currTask = null;
    const currentUser = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    let [selectedStatus, setSelectedStatus] = useState(null);
    let [selectedTask, setSelectedTask] = useState(null);

    const preventEvent = (e) => e.preventDefault();

    const addTaskToArray = (inputTask, pointerTask, arr) => {
        const index = arr.findIndex((el) => el.id === pointerTask.id);

        return index !== -1
            ? [...arr.slice(0, index + 1), inputTask, ...arr.slice(index + 1)]
            : arr;
    }

    const onDrop = (e, id) => {
        e.dataTransfer.dropEffect = "move";
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        const cloneTasks = [...tasks]

        const newTasks = cloneTasks.map((x) => {
            if (x.id === taskId) {
                addTaskToArray(currTask, x, cloneTasks);
                x.status_id = id;

                apiService.tasks.Update(x.id, {
                    status_id: x.status_id,
                    description: x.description,
                    title: x.title,
                 });
            }
            return x;
        });

        updateTasks(newTasks)
    }

    const onDragStart = (e, task) => {
        e.dataTransfer.dropEffect = "none";
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", task.id.toString());
    }

    const onDragOver = (task) => {
        currTask = task;
    }

    const openCreateTask = (id) => {
        setSelectedStatus(id);
        setSelectedTask(null);
    }

    const openEditPopup = (payload) => {
        setSelectedTask(payload.id);
        setSelectedStatus(null);
    }

    const deleteTask = (value) => {
        const id = value;
        if (id)
            apiService.tasks.Delete(id).then(() => {
                apiService.tasks.Get().then((res) => {
                    updateTasks(res.data);
                });
            });
    }

    return (
        <>
            <div
                className="desk"
                onDrop={e => onDrop(e, statusId)}
                onDragOver={e => preventEvent(e)}
                onDragEnter={e => preventEvent(e)}
                style={{
                    height: `${82 + (tasks.filter((x) => x.status_id === statusId).length - 1) * 42 + 42}px`
                }}
            >
                <div className="desk_title">
                    <h4> {statusTitle} </h4>
                </div>
                <div className="desk_tasks">
                    {
                        tasks && 
                        tasks.filter((item) => item.status_id === statusId).map((task, index) => {
                            return (
                                <Task
                                    edit={openEditPopup}
                                    deleteTask={(value) => deleteTask(value)}
                                    onDragStart={e => onDragStart(e, task)}
                                    onDragOver={e => onDragOver(task)}
                                    style={{
                                        top: `${index * 40}px`
                                    }}
                                    userLogin={task.author_id === currentUser.id ? 
                                        -1 
                                        : 
                                        users.find((item) => item.id === task.author_id) &&
                                        users.find((item) => item.id === task.author_id).login
                                    }
                                    draggable="true"
                                    task={task}
                                    key={task.id} />
                            )
                        })
                    }
                    <Button
                        onClick={() => openCreateTask(statusId)}
                        classNameOut="desk_action-btn"
                        style={{
                            top: `${tasks.filter((x) => x.status_id === statusId).length * 40}px`
                        }}
                    >
                        Добавить задачу
                    </Button>
                </div>
            </div>
            {selectedStatus && 
                <CreateTaskPopup
                    isDialog={selectedStatus}
                    show={(value) => setSelectedStatus(value)}
                    updateTasks={(array) => updateTasks(array)}
                />
            }
            {selectedTask && 
                <EditTaskPopup
                    isDialog={selectedTask}
                    show={(value) => setSelectedTask(value)}
                    user={currentUser.id}
                    updateTasks={(array) => updateTasks(array)}
                />
            }
        </>
    )
}

export { Desk }