import React, {Component, Suspense, lazy} from 'react';
import {Route, Switch} from 'react-router-dom';

import CircularProgress from '../utils/CircularProgress';

const Main = lazy(() => import('../components'));

const routes = [
    {
        path: "/",
        component: Main,
        exact: true
    }
]

const RouteWithSubRoutes = (route) => {
    return (
        <Route
			path={route.path}
			render={props => (
				// pass the sub-routes down to keep nesting
				<route.component {...props} routes={route.routes} />
			)}
		/>
    );
};

class App extends Component {
    render() {
        return (
            <>
                <Suspense fallback={<CircularProgress/>}>
                    <Switch>
                        {
                            routes.map((route, i) => {
                                return (
                                    <RouteWithSubRoutes key={i} {...route} />
                                    // <Route key={i} {...route} />
                                )
                            })
                        }
                    </Switch>
                </Suspense>
            </>
        )
    }
};

export default App;