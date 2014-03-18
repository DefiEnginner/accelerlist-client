import styled from 'styled-components'

 const EditableCellInput = styled.input`
  border-color: white !important;
  text-align: center;
  &:focus {
    border-color: #82b1ff !important;
  }
`;
const EditableCell = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  height: 100%;
`;

 export {
  EditableCell,
  EditableCellInput
}; 