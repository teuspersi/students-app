import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaExclamation } from 'react-icons/fa';
import axios from '../../services/axios';
import history from '../../services/history';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form, ExcluirConta, TemCerteza } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import { toast } from 'react-toastify';

export default function Register() {
  // eslint-disable-next-line no-unused-vars
  const {
    id,
    nome: nameStored,
    email: emailStored,
  } = useSelector((state) => state.auth.user);

  const isLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (id) {
      setName(nameStored);
      setEmail(emailStored);
    }
  }, [id, emailStored, nameStored]);

  async function handleSubmit(e) {
    e.preventDefault();

    dispatch(actions.registerRequest({ name, email, password, id }));
  }

  function handleDeleteAsk(e) {
    e.preventDefault();

    const exclamation = e.currentTarget.nextSibling.firstChild;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.style.display = 'none';
  }

  async function handleDelete(e) {
    e.preventDefault();

    try {
      await axios.delete(`/users/`, {
        id,
      });

      toast.success('Conta excluída');

      dispatch(actions.loginFailure());

      history.push('/register');
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Faça login novamente');
      } else {
        errors.map((error) => toast.error(error));
      }
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar dados' : 'Crie sua conta'}</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </label>

        <label htmlFor="email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
          />
        </label>

        <label htmlFor="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>

        <button type="submit">{id ? 'Salvar' : 'Criar conta'}</button>
      </Form>

      {id && (
        <ExcluirConta
          onClick={handleDeleteAsk}
          to={`/users/${id}/delete`}
          className="actionLink"
        >
          Excluir conta
        </ExcluirConta>
      )}

      <TemCerteza>
        <FaExclamation
          size={16}
          display="none"
          cursor="pointer"
          onClick={(e) => handleDelete(e)}
        />
      </TemCerteza>
    </Container>
  );
}
