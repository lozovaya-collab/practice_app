import React from "react";

import { Combobox, TextInput, TextArea } from '../../../components';

import style from './style.module.scss';

const ContentPopup = ({ newTask, updateTask }) => {
  const statuses =  [
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
  ]
  
  const updateValue = (event, prop) => {
    updateTask({ [prop]: event.target.value})
  }

  return (
    <>
      {newTask &&
        <div className={style['content-task']}>
          <Combobox
            value={newTask.status_id}
            onChange={(e) => updateValue(e, 'status_id')}
            list={statuses}
          />
          <TextInput
            value={newTask.title}
            onChange={(e) => updateValue(e, 'title')}
          />
          <TextArea
            value={newTask.description}
            onChange={(e) => updateValue(e, 'description')}
          />
        </div>
      }
    </>
  )
}

export { ContentPopup }

