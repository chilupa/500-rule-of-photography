import React, { useMemo, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import {
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import PageShell from "../../src/components/PageShell/PageShell"
import { glass } from "../../src/styles/surfaces"
import { SELECT_MENU_PROPS } from "../../src/styles/selectMenuProps"
import { getSunWindows, formatDuration } from "../../src/lib/sunWindows"

function localCalendarDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: new Date(2024, i, 1).toLocaleDateString(undefined, { month: "long" }),
}))

const YEAR_OPTIONS = []
for (let y = 2100; y >= 1900; y -= 1) YEAR_OPTIONS.push(y)

function fmtTime(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "-"
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })
}

const WINDOW_ROWS = [
  {
    key: "morningBlue",
    title: "Morning blue hour",
    detail: "Civil twilight while the sun creeps from about −6° up to the horizon.",
  },
  {
    key: "morningGolden",
    title: "Morning golden hour",
    detail: "Warm low sun from the horizon up to roughly +6°.",
  },
  {
    key: "eveningGolden",
    title: "Evening golden hour",
    detail: "Same vibe on the way down, roughly +6° down to the horizon.",
  },
  {
    key: "eveningBlue",
    title: "Evening blue hour",
    detail: "After sunset through civil twilight, horizon down to about −6°.",
  },
]

export default function SunHoursTool() {
  const [latStr, setLatStr] = useState("")
  const [lonStr, setLonStr] = useState("")
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoHint, setGeoHint] = useState(null)

  const [selected, setSelected] = useState(() => localCalendarDate(new Date()))

  const setParts = (year, monthIndex, day) => {
    const dim = daysInMonth(year, monthIndex)
    const d = Math.min(Math.max(1, day), dim)
    setSelected(new Date(year, monthIndex, d))
  }

  const lat = parseFloat(latStr)
  const lon = parseFloat(lonStr)
  const coordsOk =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180

  const noon = useMemo(() => {
    const y = selected.getFullYear()
    const m = selected.getMonth()
    const d = selected.getDate()
    return new Date(y, m, d, 12, 0, 0, 0)
  }, [selected])

  const windows = useMemo(() => {
    if (!coordsOk) return null
    return getSunWindows(lat, lon, noon)
  }, [coordsOk, lat, lon, noon])

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoHint("Location isn’t available in this browser.")
      return
    }
    setGeoLoading(true)
    setGeoHint(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatStr(String(Math.round(pos.coords.latitude * 1e5) / 1e5))
        setLonStr(String(Math.round(pos.coords.longitude * 1e5) / 1e5))
        setGeoLoading(false)
      },
      () => {
        setGeoLoading(false)
        setGeoHint("Couldn’t grab location. Type lat and lon yourself.")
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 }
    )
  }

  return (
    <>
      <Head>
        <title>Blue & golden hour windows</title>
        <meta
          name="description"
          content="Blue hour and golden hour times from your lat and lon. Runs in the browser, no upload."
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
                "&:hover": {
                  color: "primary.light",
                  bgcolor: "rgba(255,255,255,0.04)",
                },
              }}
            >
              ← All tools
            </Button>
            <Typography
              variant="overline"
              sx={{ display: "block", color: "primary.light", mb: 1 }}
            >
              Natural light
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Blue & golden hour
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Blue hour around civil twilight, golden hour when the sun is still low. Punch in
              where you will stand. Times use whatever timezone your phone or laptop thinks you are
              in.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              ...glass,
              p: { xs: 2.25, sm: 3 },
              borderRadius: 2,
              position: "relative",
              overflow: "visible",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, rgba(232, 184, 109, 0.55), rgba(124, 184, 255, 0.85), transparent)",
                opacity: 0.95,
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, pt: 0.5, fontWeight: 600 }}>
              Location
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Latitude (°)"
                  value={latStr}
                  onChange={e => setLatStr(e.target.value)}
                  placeholder="e.g. 37.77"
                  inputProps={{ inputMode: "decimal" }}
                  helperText="−90 to 90"
                />
                <TextField
                  fullWidth
                  label="Longitude (°)"
                  value={lonStr}
                  onChange={e => setLonStr(e.target.value)}
                  placeholder="e.g. −122.42"
                  inputProps={{ inputMode: "decimal" }}
                  helperText="−180 to 180"
                />
              </Stack>
              <Box>
                <Button
                  variant="outlined"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  startIcon={
                    geoLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : null
                  }
                >
                  Use current location
                </Button>
                {geoHint && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    {geoHint}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
              Date
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Local calendar day you want times for.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
              sx={{
                width: "100%",
                "& .MuiFormControl-root": { flex: { sm: 1 }, minWidth: 0 },
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="sunh-year-label">Year</InputLabel>
                <Select
                  labelId="sunh-year-label"
                  label="Year"
                  value={selected.getFullYear()}
                  onChange={e =>
                    setParts(Number(e.target.value), selected.getMonth(), selected.getDate())
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: { xs: "center", sm: "left" },
                    },
                  }}
                  MenuProps={{
                    ...SELECT_MENU_PROPS,
                    PaperProps: { sx: { maxHeight: 280 } },
                  }}
                >
                  {YEAR_OPTIONS.map(y => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="sunh-month-label">Month</InputLabel>
                <Select
                  labelId="sunh-month-label"
                  label="Month"
                  value={selected.getMonth()}
                  onChange={e =>
                    setParts(selected.getFullYear(), Number(e.target.value), selected.getDate())
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: { xs: "center", sm: "left" },
                    },
                  }}
                  MenuProps={{
                    ...SELECT_MENU_PROPS,
                    PaperProps: { sx: { maxHeight: 280 } },
                  }}
                >
                  {MONTH_OPTIONS.map(m => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="sunh-day-label">Day</InputLabel>
                <Select
                  labelId="sunh-day-label"
                  label="Day"
                  value={selected.getDate()}
                  onChange={e =>
                    setParts(
                      selected.getFullYear(),
                      selected.getMonth(),
                      Number(e.target.value)
                    )
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: { xs: "center", sm: "left" },
                    },
                  }}
                  MenuProps={{
                    ...SELECT_MENU_PROPS,
                    PaperProps: { sx: { maxHeight: 280 } },
                  }}
                >
                  {Array.from(
                    { length: daysInMonth(selected.getFullYear(), selected.getMonth()) },
                    (_, i) => i + 1
                  ).map(day => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {coordsOk && (
            <Paper
              elevation={0}
              sx={{
                ...glass,
                p: { xs: 2.25, sm: 3 },
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                Times for{" "}
                {selected.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Solar noon ~ {fmtTime(windows.solarNoon)} · Sunrise ~ {fmtTime(windows.sunrise)} ·
                Sunset ~ {fmtTime(windows.sunset)}
              </Typography>

              {!windows.sunrise && (
                <Typography variant="body2" color="warning.light" sx={{ mb: 2 }}>
                  No sunrise/sunset this day at this latitude (polar season). Window times may be
                  missing.
                </Typography>
              )}

              <Stack spacing={2}>
                {WINDOW_ROWS.map(row => {
                  const w = windows[row.key]
                  return (
                    <Box
                      key={row.key}
                      sx={{
                        py: 1.75,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {row.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                        {row.detail}
                      </Typography>
                      {w ? (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 0.5, sm: 3 }}
                          sx={{ alignItems: { sm: "baseline" } }}
                        >
                          <Typography variant="body2">
                            <Box component="span" color="text.secondary">
                              Start{" "}
                            </Box>
                            <Box component="span" sx={{ fontWeight: 600 }}>
                              {fmtTime(w.start)}
                            </Box>
                          </Typography>
                          <Typography variant="body2">
                            <Box component="span" color="text.secondary">
                              End{" "}
                            </Box>
                            <Box component="span" sx={{ fontWeight: 600 }}>
                              {fmtTime(w.end)}
                            </Box>
                          </Typography>
                          <Typography variant="body2" color="primary.light">
                            ≈ {formatDuration(w.durationMs)}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not applicable for this date / latitude (e.g. polar night or missing
                          crossing).
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          )}

          {!coordsOk && (
            <Typography variant="body2" color="text.secondary">
              Enter valid latitude and longitude to see blue and golden windows.
            </Typography>
          )}

          <Paper
            elevation={0}
            sx={{
              ...glass,
              p: { xs: 2.25, sm: 3 },
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 1.5 }}>
              How this works
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Under the hood this uses the usual SunCalc style angles: civil stuff near −6°, golden
              band near +6°, sunrise and sunset with boring standard refraction math. Hills, haze,
              and standing on a ridge still change what your eyes actually see.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toss in{" "}
              <MuiLink component={Link} href="/tools/moon-phase" color="primary.light" fontWeight={600}>
                moon phase
              </MuiLink>{" "}
              if you also care how bright the sky probably feels at night.
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
              Ballpark sun math. Still go outside and look at the real ridge line before you trust
              your life to it.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
