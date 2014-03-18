import styled from 'styled-components';
import { Collapse } from 'reactstrap';

const StyledCollapse = styled(Collapse)`
  width: 100%;
  justify-content: space-between;

  .navbar-nav .nav-link {
    color: #fff;
  }

  .nav-item {
    position: relative;

    .badge {
      position: absolute;
      top: -1em;
      left: -1em;
      font-size: 11px;

      &.badge-danger {
        background-color: #af2020;
      }
    }
  }
`;

export {
  StyledCollapse
}; 