import React from "react";
import "./App.css";
import Calculator from "./conponent/Caluculator";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App({ signOut, user }: any) {
  return (
    <div className="App">
      <Calculator />
      {user ? (
        <>
          <h3>私は権限を持っています:{user.username}</h3>
          <button onClick={signOut}>サインアウト</button>
        </>
      ) : (
        <h3>権限がありません</h3>
      )}
    </div>
  );
}

export default withAuthenticator(App);
