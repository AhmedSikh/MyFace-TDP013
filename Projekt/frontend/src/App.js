import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Search from "./pages/search/Search";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/notfound/NotFound";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Profile /> : <Login />}
        </Route>
        
        <Route exact path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>

        <Route exact path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>

        <Route path="/search">
          {user ? <Search /> : <Redirect to="/login" />}
        </Route>
        
        <Route exact path="/404">
          <NotFound />
        </Route>

        <Route exact path="/:id">
          {user ? <Profile /> : <Redirect to="/login" />}
        </Route>

        <Route path="/">
          <Redirect to="/404" />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
