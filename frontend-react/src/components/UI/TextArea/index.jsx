import React from "react";

import style from './style.module.scss';

const TextArea = ({ placeholder, text, onChange, ...props }) => {
  return (
    <textarea
      value={text}
      onChange={onChange}
      className={style['text-area']}
      placeholder={placeholder}
      {...props}
    >
    </textarea>
  )
}

export {TextArea}


