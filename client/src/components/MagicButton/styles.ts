import styled from "styled-components";

export const Btn = styled.button`
  width: 350px;
  height: 68px;
  font-size: 22px;
  border-radius: 14px;
  border: 0;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  background-color: #c100fe;
  justify-content: center;
  align-items: center;

  :disabled {
    background-color: #4e4e4e;
  }
`;
