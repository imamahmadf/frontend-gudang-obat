// src/Components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state sehingga berikutnya akan merender fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Anda dapat juga mencatat kesalahan ke layanan pelaporan kesalahan
    console.error("Kesalahan ditangkap:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Anda dapat merender UI cadangan apa pun
      return <h1>Terjadi kesalahan. Silakan coba lagi nanti.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
