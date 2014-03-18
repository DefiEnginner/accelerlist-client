import React from "react";
class Calendar extends React.Component {
  render() {
    return (
        <svg width="18" height="18" viewBox="0 3 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9 3H1C.5 3 0 3.5 0 4.1V20c0 .6.5 1.1 1.1 1.1H17c.6 0 1.1-.5 1.1-1.1V4c0-.6-.5-1.1-1.1-1.1zM6.8 16.5H4.5v-5.6h2.3v5.6zm3.3 0H8v-9H10v9zm3.4 0h-2.3V12h2.3v4.5z" fill="#9EA29C" fillRule="evenodd" />
        </svg>
    );
  }
}

Calendar.propTypes = {
};

export default Calendar;
