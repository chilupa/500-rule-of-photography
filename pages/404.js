import React from 'react'
import Head from 'next/head'
import { Container, Typography, Box } from '@mui/material'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <Container maxWidth="md">
        <Box textAlign="center" mt={8}>
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1">
            The page you are looking for doesn't exist.
          </Typography>
        </Box>
      </Container>
    </>
  )
}