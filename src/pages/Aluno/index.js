import React, { useEffect } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture } from './styled';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Aluno({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', null);
  const [nome, setNome] = React.useState('');
  const [sobrenome, setSobrenome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [idade, setIdade] = React.useState('');
  const [peso, setPeso] = React.useState('');
  const [altura, setAltura] = React.useState('');
  const [foto, setFoto] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        if (id) setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, 'Fotos[0].url', '');

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);
        setFoto(Foto);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const errors = get(err, 'response.data.errors', []);
        const status = get(err, 'response.status', 0);

        if (status === 400) errors.map((error) => toast.error(error));
      }
    }

    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const formErrors = [];

    if (nome.length < 3 || nome.length > 255) {
      formErrors.push('Nome precisa ter entre 3 e 255 caracteres');
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors.push('Sobrenome precisa ter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors.push('Email inválido');
    }

    if (!isInt(String(idade))) {
      formErrors.push('Idade inválida');
    }

    if (!isInt(String(peso))) {
      formErrors.push('Peso inválido');
    }

    if (!isFloat(String(altura))) {
      formErrors.push('Altura inválida');
    }

    formErrors.map((error) => toast.warn(error));

    if (formErrors.length === 0) {
      try {
        setIsLoading(true);
        if (id) {
          await axios.put(`/alunos/${id}`, {
            nome,
            sobrenome,
            email,
            idade,
            peso,
            altura,
          });
          toast.success('Aluno(a) editado(a)');
        } else {
          const { data } = await axios.post('/alunos/', {
            nome,
            sobrenome,
            email,
            idade,
            peso,
            altura,
          });
          toast.success('Aluno(a) criado(a)');
          history.push(`/aluno/${data.id}/edit`);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const errors = get(err, 'response.data.errors', []);
        const status = get(err, 'response.status', 0);

        if (errors.length > 0) {
          errors.map((error) => toast.error(error));
        } else {
          toast.error('Erro desconhecido');
          console.log(err);
        }

        if (status === 401) dispatch(actions.loginFailure());
      }
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>{id ? 'Editar aluno' : 'Novo Aluno'}</h1>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          required
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Sobrenome"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          required
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />
        <input
          required
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Peso"
        />
        <input
          required
          type="number"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Altura"
        />
        <button type="submit">{id ? 'Editar' : 'Criar aluno'}</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
