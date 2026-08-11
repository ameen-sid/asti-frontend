import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './shared/pages/loginPage'
import {BrowserRouter as Router ,Route,Routes} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Router>
          <Routes>
    <Route path="/" element={<LoginPage/>}></Route>

          </Routes>

        </Router>
      </div>
    </>
  )
}

export default App
