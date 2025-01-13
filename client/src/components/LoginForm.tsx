import { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import Auth from '../utils/auth';

interface LoginFormProps {
  handleModalClose: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = ({ handleModalClose }: LoginFormProps) => {
  const [userFormData, setUserFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidated(true);

    if (!userFormData.email || !userFormData.password) {
      setShowAlert(true);
      setAlertMessage('All fields are required.');
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { email: userFormData.email, password: userFormData.password },
      });

      if (!data) {
        throw new Error('Error during login');
      }

      Auth.login(data.login.token);
      handleModalClose();
    } catch (err: any) {
      console.error('Error during login:', err);
      setAlertMessage('Invalid credentials. Please try again.');
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {showAlert && <Alert dismissible onClose={() => setShowAlert(false)} variant="danger">
          {alertMessage}
        </Alert>}

        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          type="submit"
          variant="success">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
