import { CssBaseline, MuiThemeProvider, colors, createMuiTheme } from "@material-ui/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import configureStore from "./store";
import { Provider } from 'react-redux';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export const store = configureStore();

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: colors.cyan,
        secondary: colors.pink,
    },
});

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Provider store={store}>
            <MuiThemeProvider theme={darkTheme}>
                <App/>
            </MuiThemeProvider>
        </Provider>
    </React.Fragment>,
    document.getElementById("body")
);
