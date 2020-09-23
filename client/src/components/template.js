import React, {Component} from "react";
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actSample from '../redux/actions/sample';

class Template extends Component {
    constructor(props) {
        super()

        this.state = {

        }
    }

    UNSAFE_componentWillMount() {
        // Here you will load your action redux
        // this.props.actSample.loadSampleList()
    }

    render() {
        const {sample} = this.props;
        console.log(sample, 'DATA PROPS: From mapStateToProps function');

        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sample: state.sample.samplelist
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actSample: bindActionCreators(actSample, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Template))