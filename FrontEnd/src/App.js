import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import ViewRecord from './components/ViewRecord';
import Monitor from './components/Monitor';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/ViewRecord" exact component={ViewRecord} />
            <Route path="/Monitor" exact component={Monitor} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
