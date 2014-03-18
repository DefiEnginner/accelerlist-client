import styled from 'styled-components';

const StyledDropzoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .dropzone-component {
    text-align: center;
    cursor: pointer;
  }
`;

const StyledFileView = styled.div`
  display: flex;
  justify-content: center;

  .img-file-icon {
    width: 3em;
  }

  .upload-info {
    margin-left: .5em;

    .filename {
      margin-bottom: 0.3em;
      font-size: 15px;
      font-weight: 600;
    }
  }
`;

export {
  StyledDropzoneContainer,
  StyledFileView
}; 