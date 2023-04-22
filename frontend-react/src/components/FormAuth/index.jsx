import React from 'react';

import { TextInput } from "../../components";

const FormAuth = ({ user, update }) => {
  const updateValue = (event, prop) => {
    update({ [prop]: event.target.value})
  }

  return (
    <section className="form-auth">
      <TextInput
        value={user.login}
        onChange={(e) => updateValue(e, 'login')}
        type={'text'}
        placeholder={'логин'}
      />
      <TextInput
        value={user.password}
        onChange={(e) => updateValue(e, 'password')}
        type={'password'}
        placeholder={'пароль'}
      />
    </section>
  )
}

export { FormAuth }
