import { Component } from "react";
import { Typography } from "@mui/material";

class NormalErrorBoundary extends Component {
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

  componentDidCatch(error, errorInfo) {
    // log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography variant="subtitle1" align="center" sx={{ color: "red" }}>
          Something is wrong. Please try again later.
        </Typography>
      );
    }

    return this.props.children;
  }
}

export default NormalErrorBoundary;
