import styled from 'styled-components/native';

export const H1 = styled.Text`
  color: ${props => props.theme.onBackground};
  font-family: ${props => props.theme.font};
  font-size: 96px;
  font-weight: 300;
  letter-spacing: -1.5px;
`;
