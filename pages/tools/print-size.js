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
  Grid,
  Link as MuiLink,
  MenuItem,
} from "@mui/material"
import PageShell from "../../src/components/PageShell/PageShell"
import { glass } from "../../src/styles/surfaces"
import {
  megapixelsFromPixels,
  printSizeInches,
  inchesToMm,
  pixelsForPrintSize,
  effectiveDpi,
} from "../../src/lib/printMath"

function fmtNum(n, digits = 2) {
  if (n == null || !Number.isFinite(n)) return "-"
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(digits, 2),
  })
}

export default function PrintSizeTool() {
  const [pxW, setPxW] = useState("6000")
  const [pxH, setPxH] = useState("4000")
  const [dpi, setDpi] = useState("300")

  const [targetWIn, setTargetWIn] = useState("")
  const [targetHIn, setTargetHIn] = useState("")
  const [targetDpi, setTargetDpi] = useState("300")

  const [physWIn, setPhysWIn] = useState("")
  const [physHIn, setPhysHIn] = useState("")

  const w = parseFloat(pxW)
  const h = parseFloat(pxH)
  const dpiN = parseFloat(dpi)
  const pixelsOk =
    Number.isFinite(w) &&
    Number.isFinite(h) &&
    w > 0 &&
    h > 0 &&
    Number.isFinite(dpiN) &&
    dpiN > 0

  const forward = useMemo(() => {
    if (!pixelsOk) return null
    const mp = megapixelsFromPixels(w, h)
    const inches = printSizeInches(w, h, dpiN)
    if (!inches) return null
    return {
      mp,
      widthIn: inches.widthIn,
      heightIn: inches.heightIn,
      widthMm: inchesToMm(inches.widthIn),
      heightMm: inchesToMm(inches.heightIn),
    }
  }, [pixelsOk, w, h, dpiN])

  const tw = parseFloat(targetWIn)
  const th = parseFloat(targetHIn)
  const tdpi = parseFloat(targetDpi)
  const reverseOk =
    Number.isFinite(tw) &&
    Number.isFinite(th) &&
    tw > 0 &&
    th > 0 &&
    Number.isFinite(tdpi) &&
    tdpi > 0

  const reverse = useMemo(() => {
    if (!reverseOk) return null
    const px = pixelsForPrintSize(tw, th, tdpi)
    if (!px) return null
    const mp = megapixelsFromPixels(px.widthPx, px.heightPx)
    return { ...px, mp }
  }, [reverseOk, tw, th, tdpi])

  const pw = parseFloat(physWIn)
  const ph = parseFloat(physHIn)
  const effectiveOk =
    pixelsOk &&
    Number.isFinite(pw) &&
    Number.isFinite(ph) &&
    pw > 0 &&
    ph > 0

  const effective = useMemo(() => {
    if (!effectiveOk) return null
    return effectiveDpi(w, h, pw, ph)
  }, [effectiveOk, w, h, pw, ph])

  return (
    <>
      <Head>
        <title>Print size, DPI & megapixels</title>
        <meta
          name="description"
          content="Convert pixel dimensions to print size at 240/300 DPI, compute megapixels for a target print, and check effective DPI."
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
              Output
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Print size & DPI
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Figure out how big your file prints at 240 or 300 DPI, how chunky a print needs to be
              in pixels, or what DPI you really get when you blow something up.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              From your image pixels
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  label="Width (px)"
                  value={pxW}
                  onChange={e => setPxW(e.target.value)}
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  label="Height (px)"
                  value={pxH}
                  onChange={e => setPxH(e.target.value)}
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="DPI"
                  value={dpi}
                  onChange={e => setDpi(e.target.value)}
                  SelectProps={{ native: false }}
                >
                  {["72", "150", "240", "300", "360", "600"].map(d => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {forward && (
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Megapixels
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  {fmtNum(forward.mp, 2)} MP
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Print size at {dpiN} DPI
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {fmtNum(forward.widthIn, 2)} × {fmtNum(forward.heightIn, 2)} in
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {fmtNum(forward.widthMm, 1)} × {fmtNum(forward.heightMm, 1)} mm
                </Typography>
              </Box>
            )}

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
              Effective DPI on a given print size
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
              If this file is printed at:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Print width (in)"
                  value={physWIn}
                  onChange={e => setPhysWIn(e.target.value)}
                  placeholder="e.g. 20"
                  inputProps={{ inputMode: "decimal" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Print height (in)"
                  value={physHIn}
                  onChange={e => setPhysHIn(e.target.value)}
                  placeholder="e.g. 13.33"
                  inputProps={{ inputMode: "decimal" }}
                />
              </Grid>
            </Grid>
            {effective && (
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                Effective resolution ≈{" "}
                <Box component="span" fontWeight={700} color="primary.light">
                  {fmtNum(effective.dpiX, 1)}
                </Box>{" "}
                ×{" "}
                <Box component="span" fontWeight={700} color="primary.light">
                  {fmtNum(effective.dpiY, 1)}
                </Box>{" "}
                DPI (horizontal × vertical)
              </Typography>
            )}
          </Paper>

          <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Pixels needed for a target print
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Width (in)"
                  value={targetWIn}
                  onChange={e => setTargetWIn(e.target.value)}
                  inputProps={{ inputMode: "decimal" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Height (in)"
                  value={targetHIn}
                  onChange={e => setTargetHIn(e.target.value)}
                  inputProps={{ inputMode: "decimal" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="DPI"
                  value={targetDpi}
                  onChange={e => setTargetDpi(e.target.value)}
                >
                  {["72", "150", "240", "300", "360", "600"].map(d => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            {reverse && (
              <Box sx={{ mt: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Minimum pixel dimensions (each edge × DPI)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {reverse.widthPx.toLocaleString()} × {reverse.heightPx.toLocaleString()} px
                </Typography>
                <Typography variant="body2" color="primary.light" sx={{ mt: 0.5 }}>
                  ≈ {fmtNum(reverse.mp, 2)} megapixels
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 1.5 }}>
              Notes
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Printers often quote 240–300 DPI for continuous tone; large prints may be interpolated.
              Those pixel counts assume edge to edge at that DPI. Add extra if your lab trims
              borders.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See also{" "}
              <MuiLink component={Link} href="/tools/500-rule" color="primary.light" fontWeight={600}>
                500 rule
              </MuiLink>{" "}
              for capture resolution vs focal length.
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
              Just a planning aid. Talk to your lab about bleed and color profiles before you
              order big.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
