import { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';
import Auth from '../utils/auth';

interface UserFormData {
  username: string;
  email: string;
  password: string;
}

interface SignupFormProps {
  handleModalClose: () => void;
}

const SignupForm = ({ handleModalClose }: SignupFormProps) => {
  // set initial form state
  const [userFormData, setUserFormData] = useState<UserFormData>({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated, setValidated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  // set state for alert message
  const [alertMessage, setAlertMessage] = useState('');
  // set state for loading
  const [loading, setLoading] = useState(false);

  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidated(true);

    if (!userFormData.username || !userFormData.email || !userFormData.password) {
      setShowAlert(true);
      setAlertMessage('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting signup form with data:', userFormData);
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      console.log('Signup response data:', data);

      if (!data) {
        throw new Error('Error during signup');
      }

      Auth.login(data.addUser.token);
      handleModalClose();
    } catch (err: any) {
      console.error('Error during signup:', err);
      if (err.message.includes('E11000 duplicate key error')) {
        setAlertMessage('Username already exists. Please choose a different username.');
      } else {
        setAlertMessage('Signup failed');
      }
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {showAlert && <Alert dismissible onClose={() => setShowAlert(false)} variant="danger">
          {alertMessage}
        </Alert>}

        <Form.Group>
          <Form.Label htmlFor="username" className='custom-label'>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email" className='custom-label'>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder=""
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password" className='custom-label'>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={loading}
          type="submit"
          // variant="success"
          className='custom-button'>
          {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
