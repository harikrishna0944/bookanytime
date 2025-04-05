import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Divider  } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import { Email, Phone, CalendarToday } from '@mui/icons-material';


const FeedbackAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/feedback/feedback-logs`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  if (users.length === 0) return <p>No users found.</p>;

  return (
    <Container className="my-5">
      <Row className="g-4">
        {users.map(user => (
          <Col xs={12} md={6} lg={4} key={user._id}>
            <Card
              className="shadow-sm border-0 rounded-4 h-100"
              style={{
                backgroundColor: "#f8f9fa",
                transition: '0.3s',
                height: '100%',
              }}
            >
              <CardContent className="d-flex flex-column h-100 justify-content-between">
                {/* Header Section */}
                <div className="mb-3">
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    {user.username}
                  </Typography>
                  <Typography variant="caption" className="d-flex align-items-center text-muted">
                    <CalendarToday fontSize="small" className="me-1" />
                    {new Date(user.createdAt).toLocaleString()}
                  </Typography>
                </div>

                <Divider className="my-2" />

                {/* Contact Info */}
                <div className="mb-2">
                  <Typography variant="body2" className="d-flex align-items-center">
                    <Email fontSize="small" className="me-1 text-secondary" /> {user.email}
                  </Typography>
                  <Typography variant="body2" className="d-flex align-items-center">
                    <Phone fontSize="small" className="me-1 text-secondary" /> {user.phone}
                  </Typography>
                </div>

                <Divider className="my-2" />

                {/* Description */}
                <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                  <Typography variant="subtitle2" className="text-dark mb-1">Feedback:</Typography>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  >
                    {user.description}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};


export default FeedbackAdmin;
