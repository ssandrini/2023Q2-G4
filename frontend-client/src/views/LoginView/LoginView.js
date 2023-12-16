import { Amplify } from 'aws-amplify';
import { awsExports } from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from "aws-amplify";
import React, { useState, useEffect } from 'react';


Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID
  }
});

function LoginView() {

  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      console.log(token)
      setJwtToken(token);


      // TODO: should we use getIdToken  ? ? ? ? 
      localStorage.setItem("token", token);

      const payloadBase64 = jwtToken.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payloadData = JSON.parse(decodedPayload);
      localStorage.setItem("cognitoSub", payloadData.sub);


    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };


  return (
    <div style={{ background: '#3179ba', paddingTop: '20px', minHeight: '100vh'}}>
      <Authenticator initialState='signIn'
        components={{
          SignUp: {
            FormFields() {

              return (
                <div>
                  <Authenticator.SignUp.FormFields />

                  {/* Custom fields for given_name and family_name */}
                  <div><label>First name</label></div>
                  <input
                    type="text"
                    name="given_name"
                    placeholder="Please enter your first name"
                  />
                  <div><label>Last name</label></div>
                  <input
                    type="text"
                    name="family_name"
                    placeholder="Please enter your last name"
                  />
                  <div><label>Email</label></div>
                  <input
                    type="text"
                    name="email"
                    placeholder="Please enter a valid email"
                  />


                </div>
              );
            },
          },
        }}
        services={{
          async validateCustomSignUp(formData) {
            if (!formData.given_name) {
              return {
                given_name: 'First Name is required',
              };
            }
            if (!formData.family_name) {
              return {
                family_name: 'Last Name is required',
              };
            }
            if (!formData.email) {
              return {
                email: 'Email is required',
              };
            }
          },
        }}
      >
        {({ signOut, user }) => (
          <div>Welcome {user.username}
            <button onClick={signOut}>Sign out</button>
            <h4>Your JWT token:</h4>
            {jwtToken}
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default LoginView; 