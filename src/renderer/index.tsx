import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Router>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Router>
);
