import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Build404, BuildPage } from './pages';
import './App.css';

function App() {
  return (
    <body className='h-100 bg-light'>
      <BrowserRouter>
        <div className='d-flex flex-column h-100'>
          <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
            <div className='container'>
              <a className='navbar-brand' href='/'>
                Hexlet Chat
              </a>
            </div>
          </nav>
          <div className='container-fluid h-100'>
            <div className='row justify-content-center align-content-center h-100'>
              <Routes>
                <Route path='*' element={<Build404 />} />
                <Route path='/' element={<BuildPage />} />
                <Route path='login' element={<BuildPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </body>
  );
}

export default App;
