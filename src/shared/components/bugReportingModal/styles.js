import styled from 'styled-components'

  const CustomLabelInputFile = styled.label`
    display: flex !important;
    align-items: center;
    justify-content: center;
    max-width: 200px;
    width: 100%;
    height: 100%;
    font-size: 1rem !important;
  `;

  const BlinkerDiv = styled.div`
    color: red;
    animation: blinker 1s cubic-bezier(.5, 0, 1, 1) infinite alternate;
    @keyframes blinker { to { opacity: 0; } }
  `;

 export {
  CustomLabelInputFile,
  BlinkerDiv
}; 
 