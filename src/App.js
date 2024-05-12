import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './LoginPage';
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path={"/"} component={LoginPage} />
                <Route path={"/home"} component={HomePage} />
            </Switch>
        </Router>
    );
}

export default App;
