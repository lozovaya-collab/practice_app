import React from "react";

import style from './style.module.scss';

const Popup = ({ isOpen, title, content, actions }) => {
  return (
    <>
      { !!isOpen && 
        <div className={style.popup}>
          <div className={style.popup_wrapper}>
            <h3 className={style.popup_title}>
              {title}
            </h3>
            <div className={style.popup_content}>
              {content}
            </div>
            <div className={style.popup_actions}>
              {actions}
            </div>
          </div>
        </div>
    }
    </>
  )
}

export { Popup }


