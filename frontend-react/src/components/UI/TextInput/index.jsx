import { React } from "react";

import style from './style.module.scss';

const TextInput = ({type, placeholder, value, onChange, ...props}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      className={style['text-input']}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  )
}

export { TextInput }


