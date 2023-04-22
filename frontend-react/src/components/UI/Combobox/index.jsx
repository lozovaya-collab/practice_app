import React from "react"

import style from './style.module.scss';

const Combobox = ({ value, onChange, list, ...props }) => { 
  const defaultOption = {
    id: -1,
    name: "Выберите один из вариантов",
  }

  return (
    <div className={style.combobox}>
      <select
        value={value}
        onChange={onChange}
        className={style.combobox_select}
      >
        <option disabled value={defaultOption.id}>Выберите один из вариантов</option>
        {list &&
          list.map(option => {
            return (
              <option key={option.id} value={option.id}>
                { option.name }
              </option>
            )
          })
        }
      </select>
    </div>
  )
}

export { Combobox }



