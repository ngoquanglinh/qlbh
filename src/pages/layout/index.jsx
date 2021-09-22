import React from 'react';
import routes from './routes';
import { Redirect, Route, Switch, Link, matchPath } from 'react-router-dom';

export default function Index() {
    const arrRoutes = Object.values(routes);
    const render = ({ component, noLayout, title }, routeProps) => {
        document.title = title;
        const { location, match, history } = routeProps;
        component = React.createElement(component, { ...routeProps });
        return (
            <main>{component}</main>
        )
    }
    return (
        <React.Fragment>
            <Switch>
                {
                    arrRoutes.map(({ path, exact, ...layoutProps }) => (
                        <Route
                            key={path}
                            path={path}
                            exact={exact}
                            render={props => render(layoutProps, props)}
                        />
                    ))
                }
            </Switch>
        </React.Fragment>
    )
}
