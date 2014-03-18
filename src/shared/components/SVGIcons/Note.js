



import React from "react";
class Note extends React.Component {
  
  render() {
    return (
      <svg width="20" height="16" viewBox="0 3 20 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 9l-6-6H2a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V9zm-7-4.5l5.5 5.5H13V4.5z" fill="#CECECE" fillRule="evenodd"/>
      </svg>
    );
  }
}

Note.propTypes = {
};

export default Note;
