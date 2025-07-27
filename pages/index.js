import React, { useState } from "react"
import Head from "next/head"
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material"

import { IoMdTime } from "react-icons/io"
import StarsBackground from "../src/components/StarsBackground"

export default function Home() {
  const [sensorType, setSensorType] = useState("")
  const [focalLength, setFocalLength] = useState("")
  const [result, setResult] = useState(null)

  const sensorTypes = [
    { value: "full-frame", label: "Full Frame", cropFactor: 1 },
    { value: "canon-crop", label: "Canon APS-C (1.6x)", cropFactor: 1.6 },
    { value: "nikon-crop", label: "Nikon/Sony APS-C (1.5x)", cropFactor: 1.5 },
    { value: "micro-43", label: "Micro Four Thirds (2x)", cropFactor: 2 },
  ]

  const calculateShutterSpeed = () => {
    if (!sensorType || !focalLength) return

    const sensor = sensorTypes.find(s => s.value === sensorType)
    const effectiveFocalLength = focalLength * sensor.cropFactor
    const shutterSpeed = Math.round(500 / effectiveFocalLength)

    setResult({
      shutterSpeed,
      effectiveFocalLength,
      sensorLabel: sensor.label,
    })
  }

  return (
    <>
      <Head>
        <title>Astrophotography Calculator - 500 Rule</title>
        <meta
          name="description"
          content="Calculate the perfect shutter speed for astrophotography to avoid star trails using the 500 rule"
        />
      </Head>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <div>
          <StarsBackground />
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "white" }}
            >
              500 Rule
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Calculate the perfect shutter speed using the 500 rule to avoid
              star trails
            </Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{ p: 3, mb: 3, bgcolor: "background.paper", borderRadius: 2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Camera Sensor Type</InputLabel>
                  <Select
                    value={sensorType}
                    label="Camera Sensor Type"
                    onChange={e => setSensorType(e.target.value)}
                  >
                    {sensorTypes.map(sensor => (
                      <MenuItem key={sensor.value} value={sensor.value}>
                        {sensor.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Focal Length (mm)"
                  type="number"
                  value={focalLength}
                  onChange={e => setFocalLength(e.target.value)}
                  inputProps={{ min: 1, max: 1000 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={calculateShutterSpeed}
                  disabled={!sensorType || !focalLength}
                >
                  Calculate Shutter Speed
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {result && (
            <div>
              <Card
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  background:
                    "linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)",
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2.5 }}>
                  <IoMdTime size={28} style={{ marginBottom: 12 }} />
                  <Typography variant="h4" component="div" gutterBottom>
                    {result.shutterSpeed} seconds
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5, opacity: 0.9 }}>
                    Recommended Maximum Shutter Speed
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 0.8,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={`${result.sensorLabel}`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Chip
                      label={`${focalLength}mm lens`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Chip
                      label={`${result.effectiveFocalLength}mm effective`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </div>
          )}

          <Box mt={3}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              About the 500 Rule
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              The 500 rule helps astrophotographers determine the longest
              shutter speed they can use before stars begin to show trailing due
              to Earth's rotation. Simply divide 500 by your effective focal
              length (focal length × crop factor) to get the maximum shutter
              speed in seconds.
            </Typography>
          </Box>
        </div>
      </Container>
    </>
  )
}
