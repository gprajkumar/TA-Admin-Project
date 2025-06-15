import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setValidated(true);

    // Call parent login handler
 
  const result = await onLogin({ email, password });

  if (!result.success) {
    setError(result.message || "Invalid credentials.");
  }
  };

  return (
    <Container className="login-container">
      <Card className="login-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Welcome Back</h2>
          <p className="text-center text-muted mb-4">Login to your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" className="login-btn">
                Log In
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
