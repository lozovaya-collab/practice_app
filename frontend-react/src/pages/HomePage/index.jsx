import  React, { useState, useEffect } from "react";

import { apiService } from '../../shared/api/swagger/swagger.js';

import { Desk } from "../../components";

const HomePage = () => {
  const statuses = [
    {
      id: 1,
      name: "сделать",
    },
    {
      id: 2,
      name: "в процессе",
    },
    {
      id: 3,
      name: "закончено",
    },
  ];
      
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const updateTasks = tasks => {
    setTasks(tasks)
  }

  useEffect(() => {
    apiService.tasks.Get().then((res) => {
      updateTasks(res.data);
    });

    apiService.users.Get().then((res) => {
       setUsers(res.data)
    });
  }, []);

  return (
    <div className="todo-app">
      {
        statuses && statuses.map((status) => {
            return (
              <Desk
                statusId={status.id}
                statusTitle={status.name}
                tasks={tasks}
                users={users}
                updateTasks={updateTasks}
                key={status.id} />
            );
        })
      }
    </div>
  )
}

export {  HomePage }