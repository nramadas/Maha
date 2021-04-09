import styled from 'styled-components/native';

export const H2 = styled.Text`
  color: ${props => props.theme.onBackground};
  font-family: ${props => props.theme.font};
  font-size: 60px;
  font-weight: 300;
  letter-spacing: -0.5px;
`;
