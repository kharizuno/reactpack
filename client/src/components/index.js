import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import HttpApi from '../api';
import * as helpers from '../helpers';

import { Row, Col, Input, Button, Spin, Card } from 'antd';
const { TextArea } = Input;

class App extends Component {
  constructor(props) {
      super(props)
  
      this.state = {
        content: '',
        results: [],
        notfound: '',
        loading: false
      }
  }
  
  handleState(e) {
    this.setState({content: e.target.value})
  }

  handleSubmit() {
    this.setState({results: [], notfound: '', loading: true});
    HttpApi.callPost('translate', {text: helpers.stripTags(this.state.content)}).then(dt => {
      if (dt.detail === 'Not Found') {
        this.setState({notfound: 'Not Found', loading: false});
      } else {
        this.setState({results: dt, loading: false});
      }      
    }).catch(err => {
      throw(err);
    });
  }

  render() {
    const { content, results, notfound, loading } = this.state;
    let newdata = (Object.keys(results).length > 0) ? results.content : results;

    return (
      <Row>
        <Col span={24}>
          <div className='mg-all20'>
            <Spin size='large' spinning={loading}>
              <label className='ff-14'>Text</label>
              <TextArea name='content' value={content} rows={10} onChange={(e) => this.handleState(e)}/>

              <div className='mg-t20 tx-right'>
                <Button type="primary" shape="round" onClick={(e) => this.handleSubmit()}>
                  Submit
                </Button>
              </div>
            </Spin>
          </div>          
        </Col>
        {
          notfound &&
          <Col span={24}>
            <div className='mg-all20 ff-20'>
              Translation Failed
            </div>
          </Col>
        }
        {
          Object.keys(newdata).length > 0 &&
          <>
            <label className='mg-lr20 ff-16'>Translation Results</label>
            {
              Object.keys(newdata).map((v, i) => {
                return (
                  <Col span={24} key={i}>
                    <div className='mg-all20'>
                      <Card title={(newdata[v]['src']) ? 'Source : ' + newdata[v]['src'] : ''}>
                        {
                          Object.keys(newdata[v]).map((v1, i1) => {
                            if (v1 !== 'src') {
                              return (
                                <div className='pad-tb10' key={i1}>
                                  <label>{v1.toUpperCase()}</label>
                                  <div>
                                    {newdata[v][v1]}
                                  </div>
                                </div>
                              )
                            } else {
                              return true
                            }
                          })
                        }
                      </Card>
                    </div>
                  </Col>
                )
              })
            }
          </>
        }
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))