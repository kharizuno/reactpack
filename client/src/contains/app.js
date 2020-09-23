import React, {Component, Suspense} from 'react';
import {Router, Route, Switch} from 'react-router-dom';

import CircularProgress from '../utils/CircularProgress';
import CacheBuster from "../CacheBuster";
import Main from "./main";

class App extends Component {
	constructor(props) {
		super();
		// console.log(process.env);
	}

	render() {
		const { history } = this.props;

		return (
			<CacheBuster>
				{({ loading, isLatestVersion, refreshCacheAndReload }) => {
					if (loading) return null;
					if (!loading && !isLatestVersion) {
						refreshCacheAndReload();
					}

					return (
						<Router history={history} basename="/">
							<Suspense fallback={<CircularProgress/>}>
								<Switch>
									<Route path="/" render={props => (<Main {...props}/>)}/>
								</Switch>
							</Suspense>
						</Router>
					);
				}}
			</CacheBuster>
		)
	}
}

export default App;
