import React from 'react';

import deletePng from '../../assets/images/delete.png';

const Task = ({ task, edit, userLogin, deleteTask, ...props }) => {
    return (
        <div className="desk_tasks__item" {...props}>
            <div className="task-wrapper">
                <div className="task-wrapper_container">
                    {userLogin !== -1 && 
                        <p className="task-wrapper_container__login">
                            { userLogin }
                        </p>
                    }
                </div>

                <h5 onClick={() => edit(task)}  className="task-wrapper_name">
                    { task.title }
                </h5>

                <div className="task-wrapper_container" onClick={() => deleteTask(userLogin === -1 ? task.id : null)}>
                    {userLogin === -1 &&
                        <img
                            className="task-wrapper_container__icon"
                            src={deletePng}
                            alt="del"
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export { Task }