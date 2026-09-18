import { Component } from 'react'

class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h2>Something went wrong.</h2>
          <p>Sorry, the page could not be displayed.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
