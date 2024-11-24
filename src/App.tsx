import { Toaster } from 'react-hot-toast';
import { Intro } from './components/animated/Intro';

function App() {
  return (
    <div data-component="App">
      <Toaster position="top-right" reverseOrder={false} />
      <Intro />
    </div>
  );
}

export default App;
