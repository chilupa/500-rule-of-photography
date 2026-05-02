import React, { useMemo, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import {
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import PageShell from "../../src/components/PageShell/PageShell"
import { glass } from "../../src/styles/surfaces"
import { SELECT_MENU_PROPS } from "../../src/styles/selectMenuProps"
import {
  getMoonPhase,
  skyBrightnessGuide,
  SYNODIC_MONTH,
} from "../../src/lib/moonPhase"

function formatApproxDays(n) {
  if (n < 1.5) return "about 1 day"
  const r = Math.round(n)
  return `about ${r} days`
}

function guideBarSx(hue) {
  const map = {
    dark: "linear-gradient(90deg, #7FD8BE 0%, #5CB894 100%)",
    good: "linear-gradient(90deg, #7FD8BE 0%, #7CB8FF 100%)",
    mid: "linear-gradient(90deg, #7CB8FF 0%, #E8B86D 100%)",
    bright: "linear-gradient(90deg, #E8B86D 0%, #E8956D 100%)",
    veryBright: "linear-gradient(90deg, #E8956D 0%, #D87878 100%)",
  }
  return map[hue] || map.mid
}

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

function calendarBefore(a, b) {
  return (
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
    (a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() < b.getDate())
  )
}

/** If candidate is before `minDay`, return a copy of `minDay`. */
function clampOnOrAfter(candidate, minDay) {
  return calendarBefore(candidate, minDay) ? localCalendarDate(minDay) : candidate
}

/** Months that still contain at least one date on or after `today` (no fully past months). */
function allowedMonthsForYear(year, today) {
  return MONTH_OPTIONS.filter(m => {
    const last = daysInMonth(year, m.value)
    const monthEnd = localCalendarDate(new Date(year, m.value, last))
    return !calendarBefore(monthEnd, today)
  })
}

function allowedDaysFor(year, monthIndex, today) {
  const dim = daysInMonth(year, monthIndex)
  const minD =
    year === today.getFullYear() && monthIndex === today.getMonth()
      ? today.getDate()
      : 1
  return Array.from({ length: dim - minD + 1 }, (_, i) => minD + i)
}

export default function MoonPhaseTool() {
  const today = localCalendarDate(new Date())

  const [selected, setSelected] = useState(() => localCalendarDate(new Date()))

  const yearMax = 2100
  const yearOptions = []
  for (let y = yearMax; y >= today.getFullYear(); y -= 1) yearOptions.push(y)

  const setParts = (year, monthIndex, day) => {
    const dim = daysInMonth(year, monthIndex)
    const d = Math.min(Math.max(1, day), dim)
    const candidate = new Date(year, monthIndex, d)
    setSelected(clampOnOrAfter(candidate, today))
  }

  const monthsForYear = allowedMonthsForYear(selected.getFullYear(), today)
  const daysForMonth = allowedDaysFor(
    selected.getFullYear(),
    selected.getMonth(),
    today
  )

  const moon = useMemo(() => getMoonPhase(selected), [selected])

  const guide = moon ? skyBrightnessGuide(moon.illumination) : null

  /** 0 = max darkness opportunity, 100 = brightest */
  const brightnessMeter = moon ? Math.round(moon.illumination * 100) : 0

  return (
    <>
      <Head>
        <title>Moon phase and sky brightness</title>
        <meta
          name="description"
          content="Moon phase and a rough idea how washy the sky will feel for astro. Runs entirely in your browser."
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
              Planning
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Moon phase & sky brightness
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We only let you pick today and future nights. Phase is a simple synodic model (~
              {SYNODIC_MONTH.toFixed(2)} day cycle). Fine for planning a trip, not for pointing a
              telescope to the arc minute.
            </Typography>
          </Box>

          <Paper
            component="section"
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
                  "linear-gradient(90deg, transparent, rgba(232, 184, 109, 0.65), rgba(124, 184, 255, 0.85), transparent)",
                opacity: 0.95,
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 0.75, pt: 0.5, fontWeight: 600 }}>
              Observing date
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Today onward only, using your normal local calendar date.
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
                >
                  {selected.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                useFlexGap
                sx={{
                  width: "100%",
                  alignItems: "stretch",
                  "& .MuiFormControl-root": { flex: { sm: 1 }, minWidth: 0 },
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="moon-year-label">Year</InputLabel>
                  <Select
                    labelId="moon-year-label"
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
                    {yearOptions.map(y => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="moon-month-label">Month</InputLabel>
                  <Select
                    labelId="moon-month-label"
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
                    {monthsForYear.map(m => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="moon-day-label">Day</InputLabel>
                  <Select
                    labelId="moon-day-label"
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
                    {daysForMonth.map(day => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            {moon && guide && (
              <Stack spacing={3} sx={{ mt: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: "3.5rem", sm: "4.25rem" },
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    {moon.phaseEmoji}
                  </Typography>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {moon.phaseLabel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moon.phaseIndex === 4 ? "Full" : moon.waxing ? "Waxing" : "Waning"} ·{" "}
                      {moon.labelIlluminationPct}% lit ·{" "}
                      {moon.ageDays < SYNODIC_MONTH / 2
                        ? `${moon.ageDays.toFixed(1)} d since new`
                        : `${(SYNODIC_MONTH - moon.ageDays).toFixed(1)} d until new`}
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Rough vibe for tonight
                    </Typography>
                    <Chip
                      size="small"
                      label={guide.band}
                      sx={{
                        fontWeight: 600,
                        bgcolor: "rgba(124, 184, 255, 0.14)",
                        border: "1px solid rgba(124, 184, 255, 0.28)",
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {guide.summary}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="caption" color="text.secondary">
                      Darker helps faint stuff
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Brighter moon mush
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={brightnessMeter}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.08)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: guideBarSx(guide.hue),
                      },
                    }}
                  />
                </Box>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip
                    label={`Next new moon: ${formatApproxDays(moon.daysToNextNew)}`}
                    variant="outlined"
                    sx={{ borderColor: "rgba(255,255,255,0.14)" }}
                  />
                  <Chip
                    label={`Next full moon: ${formatApproxDays(moon.daysToNextFull)}`}
                    variant="outlined"
                    sx={{ borderColor: "rgba(255,255,255,0.14)" }}
                  />
                </Stack>
              </Stack>
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
              What you’re actually getting
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Brightness here is a smooth cosine toy based on phase. Good enough to decide if you
              want to chase darker skies or lean into moon shots. Real life adds weather, haze,
              snow glare, and city glow, which this page cannot see.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you also care about star trails on a tripod, stack this next to the{" "}
              <MuiLink component={Link} href="/tools/500-rule" color="primary.light" fontWeight={600}>
                500 rule calculator
              </MuiLink>
              .
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
              Chill little moon math. Not a replacement for a real ephemeris if you need dead
              accuracy.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
