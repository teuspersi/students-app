import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Form = styled.form`
  input {
    display: none;
  }

  label {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border: 5px dashed ${colors.primaryColor};
    border-radius: 50%;
    margin: 30px auto;
    cursor: pointer;
    font-weight: bold;
    color: #444;
    overflow: hidden;
  }

  img {
    object-fit: cover;
    width: 180px;
    height: 180px;
  }
`;
