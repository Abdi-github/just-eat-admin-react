import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container
          fluid
          className="d-flex justify-content-center align-items-center py-5"
          style={{ minHeight: '60vh' }}
        >
          <Card className="border-0 shadow-sm text-center" style={{ maxWidth: 500 }}>
            <Card.Body className="p-5">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem' }} />
              </div>
              <h4 className="mb-2">Something went wrong</h4>
              <p className="text-muted mb-4">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => window.location.assign('/admin')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
