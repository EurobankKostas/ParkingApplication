
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Login from "../src/component/Login"
import Register from "../src/component/Register"
import MainPage from "./component/mainPage"
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}>
          </Route>
            <Route path="/register" element={<Register/>}/>
            <Route path="/mainPage" element={<MainPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
