'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Square extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { black } = this.props;
    
    return (
      <div className={classNames({
        black: black ? true : false,
        tile: true
      })}>
        { this.props.children }
      </div>
    );
  }
}

Square.propTypes = {
  black: PropTypes.bool
};
