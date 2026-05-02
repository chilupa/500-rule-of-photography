import React, { useMemo, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import {
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
  Stack,
} from "@mui/material"
import PageShell from "../../src/components/PageShell/PageShell"
import { SENSOR_TYPES } from "../../src/constants/sensors"
import { glass } from "../../src/styles/surfaces"

export default function FiveHundredRuleTool() {
  const [sensorType, setSensorType] = useState("")
  const [focalLength, setFocalLength] = useState("")

  const result = useMemo(() => {
    if (!sensorType || focalLength === "") return null
    const fl = Number(focalLength)
    if (!Number.isFinite(fl) || fl <= 0) return null
    const sensor = SENSOR_TYPES.find(s => s.value === sensorType)
    if (!sensor) return null
    const effectiveFocalLength = fl * sensor.cropFactor
    const shutterSpeed = Math.round(500 / effectiveFocalLength)
    return {
      shutterSpeed,
      effectiveFocalLength,
      sensorLabel: sensor.label,
      focalMm: fl,
    }
  }, [sensorType, focalLength])

  return (
    <>
      <Head>
        <title>500 rule calculator</title>
        <meta
          name="description"
          content="Calculate maximum shutter speed for untracked astro shots using the 500 rule: sensor crop, focal length, effective focal length."
        />
      </Head>

      <PageShell>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box>
            <Button
              component={Link}
              href="/"
              color="inherit"
              sx={{
                color: "text.secondary",
                mb: 2,
                minHeight: 40,
                px: 1,
                "&:hover": { color: "primary.light", bgcolor: "rgba(255,255,255,0.04)" },
              }}
            >
              ← All tools
            </Button>
            <Typography variant="overline" sx={{ display: "block", color: "primary.light", mb: 1 }}>
              Astro
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              500 rule calculator
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
              Choose your sensor size and focal length. The answer updates as you type.
            </Typography>
          </Box>

          <Paper
            component="section"
            elevation={0}
            aria-label="Shutter speed calculator inputs and result"
            sx={{
              ...glass,
              p: { xs: 2.25, sm: 3 },
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, rgba(124, 184, 255, 0.85), rgba(127, 216, 190, 0.65), transparent)",
                opacity: 0.95,
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="sensor-label">Camera sensor</InputLabel>
                  <Select
                    labelId="sensor-label"
                    value={sensorType}
                    label="Camera sensor"
                    onChange={e => setSensorType(e.target.value)}
                  >
                    {SENSOR_TYPES.map(sensor => (
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
                  label="Focal length (mm)"
                  type="number"
                  value={focalLength}
                  onChange={e => setFocalLength(e.target.value)}
                  inputProps={{ min: 1, max: 1000, inputMode: "decimal" }}
                />
              </Grid>
            </Grid>

            {result && (
              <Box sx={{ mt: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background:
                      "linear-gradient(145deg, rgba(55, 115, 190, 0.95) 0%, rgba(38, 82, 160, 0.92) 48%, rgba(28, 52, 108, 0.96) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 40px rgba(30, 70, 140, 0.45)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3, px: 2 }}>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "rgba(255,255,255,0.75)",
                        display: "block",
                        mb: 0.75,
                      }}
                    >
                      Max shutter (approx.)
                    </Typography>
                    <Typography
                      variant="h4"
                      component="p"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        mb: 2,
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {result.shutterSpeed}s
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
                      {[result.sensorLabel, `${result.focalMm}mm`, `${result.effectiveFocalLength}mm effective`].map(
                        label => (
                          <Chip
                            key={label}
                            label={label}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.12)",
                              color: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid rgba(255, 255, 255, 0.18)",
                              fontWeight: 500,
                            }}
                          />
                        )
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>

          <Paper
            component="section"
            elevation={0}
            sx={{
              ...glass,
              p: { xs: 2.25, sm: 3 },
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 1.5 }}>
              About the 500 rule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Take 500 and divide by your effective focal length (real focal length times crop).
              That’s roughly how long you can go before stars smear from Earth spinning. It’s a
              rule of thumb. Picky people with huge prints sometimes use the tighter NPF rule
              instead.
            </Typography>
          </Paper>

          <Box
            component="footer"
            sx={{
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.07)",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" component="p">
              Trust your histogram and your tripod shake before you trust any rule on the internet.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
