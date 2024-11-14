import './App.css';
import { Route } from "react-router-dom";
import HomePage from './Pages/HomePage.js'
import ChatPage from './Pages/ChatPage.js';
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div className="App">
      <Route path="/" exact component={HomePage} />
      <Route path="/chats" component={ChatPage} />
    </div>

  );
}

export default App;
