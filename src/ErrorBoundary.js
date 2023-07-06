import React, { Component } from 'react';
import { Typography } from '@material-ui/core'
import { Adornment, Sticky } from 'unity-fluent-library'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div style={{ height: "100%", display: "flex" }}>
          <div>
            <Adornment color="error" />
          </div>
          <div style={{ marginLeft: 32 }}>
            <div style={{ marginTop: 64 }}>
              <Typography style={{ margin: 8 }} variant="h3">A fatal error has occured.</Typography>
              <Typography style={{ margin: 8 }} variant="body2">
                We are sorry this happened. A log of this error has been recorded and sent to support.
              </Typography>
            </div>
            <div style={{ marginTop: 118, display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
              <Sticky
                text="Create a support ticket"
                size="small"
                color="success"
              />
              <Sticky
                text="Report this bug"
                size="small"
                color="warning"
              />
              <Sticky
                text="View Documents"
                size="small"
                color="info"
              />
            </div>
          </div>
        </div>
      )
    }
    return children;
  }
}

export default ErrorBoundary;
