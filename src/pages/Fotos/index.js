/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import { toast } from 'react-toastify';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');

  const [isLoading, setIsLoading] = React.useState(false);
  const [foto, setFoto] = React.useState('');

  React.useEffect(() => {
    async function getData() {
      if (id) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(`/alunos/${id}`);
          setFoto(get(data, 'Fotos[0].url', ''));
          setIsLoading(false);
        } catch {
          toast.error('Erro ao obter imagem');
          history.push('/');
          setIsLoading(false);
        }
      } else {
        history.push('/');
      }

      getData();
    }
  }, [id]);

  async function handleChange(e) {
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);

    setFoto(fileURL);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', file);

    try {
      setIsLoading(true);

      await axios.post('/fotos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Foto enviada');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const { status } = get(err, 'response', '');
      toast.error('Erro ao enviar foto');

      if (status === 401) dispatch(actions.loginFailure());
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Fotos</h1>

      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
