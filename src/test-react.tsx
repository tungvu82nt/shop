import React, { useState } from 'react';

const TestReact: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test React: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default TestReact;