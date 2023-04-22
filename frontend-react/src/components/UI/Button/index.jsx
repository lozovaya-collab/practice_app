import { React } from "react";

import style from './style.module.scss';

const Button = ({children, type = 'default', disabled = false, onClick, classNameOut = '', ...props }) => {
  return (
    <button
      className={`${style.button} ${classNameOut} ${type === "text" ? style['button--text'] : ''} ${disabled ? style['button--disabled'] : ''}`}
      type={type}
      disabled={disabled}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export  { Button }