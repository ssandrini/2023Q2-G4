import { Amplify } from 'aws-amplify';
import { awsExports } from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';
import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function LoginView() {
  const [jwtToken, setJwtToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      console.log(token);
      setJwtToken(token);

      // TODO: should we use getIdToken  ? ? ? ?
      localStorage.setItem('token', token);

      const payloadBase64 = jwtToken.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payloadData = JSON.parse(decodedPayload);
      localStorage.setItem('cognitoSub', payloadData.sub);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  const formFields = {
    signIn: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email',
      },
    }
  }

  const isManagerRef = useRef(false);

  return (
    <div style={{ background: '#3179ba', paddingTop: '20px', minHeight: '100vh' }}>
      <Authenticator
        initialState="signIn"
        formFields={formFields}
        components={{
          SignUp: {
            FormFields() {
              return (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>Email</label>
                    <input type="text" name="username" placeholder="Enter a valid email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>

                  <div style={{ marginBottom: '15px', }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>Nickname</label>
                    <input type="text" name="nickname" placeholder="Enter your nickname" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>
                  {/* Password */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>Password</label>
                    <input type="password" name="password" placeholder="Enter your password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>

                  {/* Confirm Password */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>Confirm Password</label>
                    <input type="password" name="password_repeat" placeholder="Confirm your password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>

                  {/* Custom fields for given_name and family_name */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>First name</label>
                    <input type="text" name="given_name" placeholder="Enter your first name" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}>Last name</label>
                    <input type="text" name="family_name" placeholder="Enter your last name" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                  </div>

                  {/* Manager Checkbox */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#344454' }}> Are you a manager? 
                    <input type="checkbox" name="address" style={{ marginLeft: '5px', border: '2px solid #3498db', borderRadius: '5px', padding: '8px', marginRight: '10px' }} ref={isManagerRef} onChange={()=>  {isManagerRef.current = !isManagerRef.current}} />
                    </label>
                  </div>
                </div>
              );
            },
          },
        }}
        services={{
          async validateSignUp(formData) {
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

            // Check if the username or email already exists
            try {
              console.log(formData)
              await Auth.signUp({
                username: formData.username,
                password: formData.password,
                attributes: {
                  nickname: formData.nickname,
                  given_name: formData.given_name,
                  family_name: formData.family_name,
                  address: formData.address
                },
              });
            } catch (error) {
              // Handle the error, check if it's a username or email already exists error
              if (error.code === 'UsernameExistsException' || error.code === 'AliasExistsException') {
                return {
                  username: 'Username or email already exists',
                  email: 'Username or email already exists',
                };
              }
              // Handle other errors if needed
              console.error('Error during sign up:', error);
            }
          },
        }}
      >
        {({ signOut, user }) => { fetchJwtToken().then(navigate('/me'))}}
      </Authenticator>
    </div>
  );
}

export default LoginView;
