import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "./redux/store";
import PublicRoutes from "./routes";
import LogRocket from "logrocket";
import { ThemeProvider } from "styled-components";
import { theme } from "./config/theme";

class App extends React.Component {
  componentDidMount() {
		const NODE_ENV = process.env.REACT_APP_LOG_ROCKET_ENV;
    if(NODE_ENV === 'production') LogRocket.init("qfo9ml/accelerlist_prod_v2");
    console.log("REACT_APP_NODE_ENV: ", process.env.REACT_APP_NODE_ENV)
  }

  render() {
    return (
      <React.Fragment>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <PublicRoutes history={history} />
          </ThemeProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
