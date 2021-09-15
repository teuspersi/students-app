import React, { useState } from 'react';
// import axios from '../../services/axios';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';

import Loading from '../../components/Loading';

export default function Login(props) {
  const dispatch = useDispatch();

  const prevPath = get(props, 'location.state.prevPath', '/');

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const formErrors = [];

    if (!isEmail(email)) {
      formErrors.push('E-mail inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors.push('Senha inválida');
    }

    formErrors.map((error) => toast.warn(error));

    if (formErrors.length === 0) {
      dispatch(actions.loginRequest({ email, password, prevPath }));
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </label>

        <label htmlFor="password">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
        </label>

        <button type="submit">Entrar</button>
      </Form>
    </Container>
  );
}
