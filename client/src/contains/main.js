import React, {Component, Suspense, lazy} from 'react';
import {withRouter, Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'redux-await';
// import {bindActionCreators} from 'redux';

import CircularProgress from '../utils/CircularProgress';
import App from './routes';

const Template = lazy(() => import('../components/template'));

class Main extends Component {
    constructor(props) {
        super();

        this.state = {

        };
    }

    render() {
        // const {location, authUser} = this.props;

        // if (location.pathname === '/') {
        //     if (!authUser) {
        //         return ( <Redirect to='/login' /> )
        //     } else {
        //         return ( <Redirect to='/dashboard' /> )
        //     }
        // }

        return (
            <Suspense fallback={<CircularProgress/>}>
                <Switch>
                    <Template><App/></Template>
                </Switch>
            </Suspense>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        authUser: false
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {}
}

export default withRouter(connect(mapStatetoProps, mapDispatchtoProps)(Main));