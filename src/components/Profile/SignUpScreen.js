import React, { useRef } from "react";
import "../../Styles/SignUpScreen.css";
import { authM } from "../../firebase";

const SignUpScreen = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const register = (e) => {
    e.preventDefault();
    authM
      .createUserWithEmailAndPassword(
        emailRef?.current?.value,
        passwordRef?.current?.value
      )

      .catch((error) => console.log(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();
    authM
      .signInWithEmailAndPassword(
        emailRef?.current?.value,
        passwordRef?.current?.value
      )
      .then()
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="signUpScreen">
      <form>
        <h1>Sign In</h1>
        <input type="email" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button type="submit" onClick={signIn}>
          Sign In
        </button>
        <h4>
          <span className="signUpScreen__gray">New to Netflix?</span>{" "}
          <span className="signUpScreen__link" onClick={register}>
            Sign Up now
          </span>
        </h4>
      </form>
    </div>
  );
};

export default SignUpScreen;
