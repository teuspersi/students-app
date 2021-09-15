/* eslint-disable no-unused-vars */
import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast, ToastContainer } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';
import { isEmail } from 'validator';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('Você entrou!');

    axios.defaults.headers.Authorization = `Baerer ${response.data.token}`;

    history.push(payload.prevPath);
  } catch (e) {
    toast.error('Usuário ou senha inválidos');

    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');

  if (token) {
    axios.defaults.headers.Authorization = `Baerer ${token}`;
  }
}

function* registerRequest({ payload }) {
  const { id, name, email, password } = payload;

  if (id) {
    try {
      yield call(axios.put, '/users', {
        email,
        nome: name,
        password: password || undefined,
      });

      toast.success('Dados editados com sucesso');
      yield put(actions.updateSuccess({ name, email, password }));
    } catch (e) {
      const errors = get(e, 'response.data.errors', []);
      const status = get(e, 'response.status', 0);

      if (status === 401) {
        toast.info('Você precisa entrar novamente');
        yield put(actions.loginFailure());
        return history.push('/login');
      }

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      yield put(actions.registerFailure());
    }
  } else {
    const formErrors = [];

    if (name.length < 3 || name.length > 255) {
      formErrors.push('Campo nome deve ter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors.push('E-mail inválido');
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors.push('Campo senha deve ter entre 6 e 50 caracteres');
    }

    formErrors.map((error) => toast.warn(error));

    if (formErrors.length === 0) {
      try {
        yield call(axios.post, '/users', {
          nome: name,
          password,
          email,
        });

        toast.success('Cadastro concluído. Bem-vindo(a)!');
        yield put(actions.registerSuccess());
        history.push('/login');
      } catch (err) {
        // const status = get(e, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        errors.map((error) => toast.error(error));
      }
    }
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
