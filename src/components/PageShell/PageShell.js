import React from "react"
import { Box, Container } from "@mui/material"
import StarsBackground from "../StarsBackground"

const pageBackground = {
  minHeight: "100vh",
  position: "relative",
  paddingLeft: "max(16px, env(safe-area-inset-left))",
  paddingRight: "max(16px, env(safe-area-inset-right))",
  paddingBottom: "max(24px, env(safe-area-inset-bottom))",
  background:
    "radial-gradient(ellipse 100% 70% at 50% -18%, rgba(68, 130, 210, 0.28), transparent 52%), radial-gradient(ellipse 80% 50% at 100% 50%, rgba(100, 90, 180, 0.08), transparent 45%), linear-gradient(165deg, #050811 0%, #080d18 38%, #060912 100%)",
}

export default function PageShell({ children, maxWidth = "md", sx = {} }) {
  return (
    <Box sx={{ ...pageBackground, ...sx }}>
      <StarsBackground />
      <Container
        maxWidth={maxWidth}
        sx={{
          py: { xs: 3, sm: 5 },
          position: "relative",
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
