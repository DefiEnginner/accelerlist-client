import styled from 'styled-components';
import { Button } from 'reactstrap';

const ArrowButton = styled(Button)`
  background-color: transparent !important;
  border: none !important;

  & > svg {
    transition: 0.5s;
  }

  & > svg:hover {
    color: #00c853;
  }
`;

const StyledReportItem = styled.div`
  position: relative;
  margin: 0 5rem;
  text-align: center;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  .icon-report {
    position: relative;
  }

  .title {
    &:hover {
      text-decoration: underline;
    }    
  }

  .icon-delete {
    position: absolute;
    top: 0;
    left: 3.3rem;
    background: #fff;
    border-radius: 50%;
    border: 2px solid #fff;
    cursor: pointer;
  }

  .icon-edit {    
    position: relative;
    top: -.1rem;
    right: -.5rem;
    cursor: pointer;
  }

  .input-group {
    width: 10rem;

    .form-control {    
      margin-right: .2rem;
      border-radius: 3px !important;
      z-index: 3;
    }

    .input-group-append .btn {
      padding-left: 0;
      padding-right: 0;
      background: #fff;
    }
  }
`;

export {
  ArrowButton,
  StyledReportItem
}; 