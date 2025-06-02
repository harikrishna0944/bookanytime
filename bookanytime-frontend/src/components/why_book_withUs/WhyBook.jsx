import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  Search as SearchIcon,
  Map as MapIcon,
  LocalOffer as OfferIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const WhyBookWithUs = () => {
  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: "Easy Search",
      description: "Find the perfect stay with our powerful search and filter options."
    },
    {
      icon: <MapIcon fontSize="large" color="primary" />,
      title: "Map Discovery",
      description: "Explore properties on our interactive map with radius search."
    },
    {
      icon: <OfferIcon fontSize="large" color="primary" />,
      title: "Special Offers",
      description: "Access exclusive deals and discounts on premium properties."
    },
    {
      icon: <VerifiedIcon fontSize="large" color="primary" />,
      title: "Verified Properties",
      description: "All properties are vetted to ensure quality and authenticity."
    }
  ];

  return (
    <Box sx={{ 
      py: { xs: 4, sm: 6 },
      backgroundColor: '#f9f9f9',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md"> {/* Changed from lg to md for narrower width */}
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: { xs: 4, sm: 5 },
            fontSize: { xs: '1.8rem', sm: '2.2rem' }
          }}
        >
          Why Book With Us
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper elevation={3} sx={{
                p: { xs: 2, sm: 2.5 }, // Slightly decreased padding
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 2,
                transition: 'transform 0.3s',
                maxWidth: 400, // Added maxWidth constraint
                margin: '0 auto', // Center the cards
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '0.95rem' } // Slightly smaller text
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyBookWithUs;