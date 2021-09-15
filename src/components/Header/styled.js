import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

export const Nav = styled.nav`
  background: ${primaryColor};
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px -3px 0px 0px rgb(0 0 0 / 15%);
  color: black;

  a {
    color: #fff;
    margin: 0 15px 0 0;
    font-weight: bold;
  }
`;
