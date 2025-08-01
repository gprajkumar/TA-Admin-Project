import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const AlertComponent = ({ state, Alert: message, title }) => {
  const [show, setShow] = useState(state);

  useEffect(() => {
    setShow(state);
  }, [state]);

  if (!show) return null;

  return (
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
  <Alert show={show} style={{ width: "90%" }} variant="success">
    <Alert.Heading>{title}</Alert.Heading>
    <p>{message}</p>
  </Alert>
</div>
  );
};

export default AlertComponent;
