import React, { useEffect } from "react";
import "./App.css";
import HomeScreen from "./components/Home/HomeScreen";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginScreen from "./components/Profile/LoginScreen";
import { authM } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import ProfileScreen from "./components/Profile/ProfileScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { getData } from "./features/subscriptionSlice";

function App() {
  const subData = useSelector(getData);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [userMonitor] = useAuthState(authM);

  useEffect(() => {
    authM.onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ uid: userMonitor?.uid, email: userMonitor?.email }));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch, userMonitor?.email, userMonitor?.uid]);

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
            <Route exact path="/profile">
              <ProfileScreen />
            </Route>

            <Route exact path="/">
              {subData?.role ? <HomeScreen /> : <Redirect to="/profile" />}
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
