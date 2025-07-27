import React from "react"
import Header from "../Header/Header"
import { Box, Container } from "@mui/material"

const Layout = ({ children }) => {
  return (
    <Container maxWidth="md">
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <Header siteTitle="500th Rule" />
      </div>
      <Box pt={2}>{children}</Box>
    </Container>
  )
}

export default Layout
