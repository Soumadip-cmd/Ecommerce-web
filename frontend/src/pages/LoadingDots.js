import React from 'react';

const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      <span className="animate-bounce delay-0">.</span>
      <span className="animate-bounce delay-100">.</span>
      <span className="animate-bounce delay-200">.</span>
    </span>
  );
};

export default LoadingDots;