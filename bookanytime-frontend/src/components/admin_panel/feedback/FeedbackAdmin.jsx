import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';

const FeedbackAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/feedback-logs`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  if (users.length === 0) return <p>No users found.</p>;

  return (
    <Container className="my-4">
      <Row className="g-4">
        {users.map(user => (
          <Col xs={12} md={6} lg={4} key={user._id}>
            <Card className="h-100 shadow-sm p-3">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Username: {user.username}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Phone: {user.phone}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: '200px', overflowY: 'auto' }}
                >
                  <strong>Description:</strong> {user.description}
                </Typography>
                <Typography variant="caption" className="text-muted d-block mt-2">
                  Created At: {new Date(user.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeedbackAdmin;
