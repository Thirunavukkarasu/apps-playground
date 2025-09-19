import styled from '@emotion/styled';
import NxWelcome from './nx-welcome';
import { Button, Card } from '@nx-monorepo/ui';

import { Route, Routes, Link } from 'react-router-dom';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <NxWelcome title="@nx-monorepo/todos-app" />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Card title="Welcome to Todos App" variant="elevated">
                <p>
                  This is the generated root route using our shared UI
                  components.
                </p>
                <Button
                  variant="primary"
                  onClick={() => alert('Hello from UI package!')}
                >
                  Test Button
                </Button>
                <br />
                <br />
                <Link to="/page-2">
                  <Button variant="outline">Go to Page 2</Button>
                </Link>
              </Card>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <Card title="Page 2" variant="outlined">
              <p>This is page 2, also using our shared UI components!</p>
              <Link to="/">
                <Button variant="secondary">Back to Home</Button>
              </Link>
            </Card>
          }
        />
      </Routes>
      {/* END: routes */}
    </StyledApp>
  );
}

export default App;
