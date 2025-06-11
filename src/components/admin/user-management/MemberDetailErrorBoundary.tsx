
import React from 'react';

interface MemberDetailErrorBoundaryProps {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class MemberDetailErrorBoundary extends React.Component<MemberDetailErrorBoundaryProps, State> {
  constructor(props: MemberDetailErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MemberDetailView error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">Unable to load member details</p>
        </div>
      );
    }

    return this.props.children;
  }
}
