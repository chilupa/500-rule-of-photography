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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import PageShell from "../../src/components/PageShell/PageShell"
import { glass } from "../../src/styles/surfaces"
import {
  exposureFactor,
  shutterForIso,
  isoForShutter,
  formatShutterSeconds,
} from "../../src/lib/exposureEquivalence"

const PRESET_ISO = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200]
const PRESET_F = [1.4, 1.8, 2, 2.8, 3.5, 4, 5.6, 8, 11, 16]

function fmtIso(iso) {
  if (iso == null || !Number.isFinite(iso) || iso <= 0) return "-"
  return `${Math.round(iso)}`
}

function fmtF(n) {
  if (n == null || !Number.isFinite(n) || n <= 0) return "-"
  const t = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "")
  return `f/${t}`
}

export default function ExposureEquivalenceTool() {
  const [isoStr, setIsoStr] = useState("6400")
  const [fStr, setFStr] = useState("2.8")
  const [tStr, setTStr] = useState("15")

  const [customIso, setCustomIso] = useState("")
  const [customT, setCustomT] = useState("")
  const [customF, setCustomF] = useState("")

  const iso = parseFloat(isoStr)
  const fn = parseFloat(fStr)
  const t = parseFloat(tStr)

  const baseOk =
    Number.isFinite(iso) &&
    Number.isFinite(fn) &&
    Number.isFinite(t) &&
    iso > 0 &&
    fn > 0 &&
    t > 0

  const k = useMemo(() => {
    if (!baseOk) return null
    return exposureFactor(iso, t, fn)
  }, [baseOk, iso, t, fn])

  const isoRows = useMemo(() => {
    if (!baseOk) return []
    return PRESET_ISO.map(i => ({
      iso: i,
      shutter: shutterForIso(iso, t, fn, i, fn),
      isBase: Math.abs(i - iso) < 0.01,
    })).filter(row => row.shutter != null && row.shutter > 0 && row.shutter < 1e7)
  }, [baseOk, iso, t, fn])

  const fRows = useMemo(() => {
    if (!baseOk) return []
    return PRESET_F.map(f => ({
      f,
      shutter: shutterForIso(iso, t, fn, iso, f),
      isBase: Math.abs(f - fn) < 0.02,
    })).filter(row => row.shutter != null && row.shutter > 0 && row.shutter < 1e7)
  }, [baseOk, iso, t, fn])

  const cIso = parseFloat(customIso)
  const cT = parseFloat(customT)
  const cF = parseFloat(customF)

  const customOutShutter =
    baseOk && Number.isFinite(cIso) && cIso > 0
      ? shutterForIso(iso, t, fn, cIso, fn)
      : null
  const customOutIso =
    baseOk && Number.isFinite(cT) && cT > 0 ? isoForShutter(iso, t, fn, cT, fn) : null
  const customOutShutterForF =
    baseOk && Number.isFinite(cF) && cF > 0
      ? shutterForIso(iso, t, fn, iso, cF)
      : null

  return (
    <>
      <Head>
        <title>Exposure equivalence</title>
        <meta
          name="description"
          content="Mess with ISO, f-stop, and shutter while keeping about the same brightness. Built for Milky Way stacks and matching subs."
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
              Exposure
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Exposure equivalence
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Think of it as keeping ISO times shutter divided by f squared in the same neighborhood.
              That lets you trade ISO for shutter speed when you stack Milky Way shots or try to line
              up exposure between frames.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Base exposure
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ISO"
                  value={isoStr}
                  onChange={e => setIsoStr(e.target.value)}
                  inputProps={{ inputMode: "numeric" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="f-number"
                  value={fStr}
                  onChange={e => setFStr(e.target.value)}
                  placeholder="2.8"
                  inputProps={{ inputMode: "decimal" }}
                  helperText="Lens aperture as a number (e.g. 2.8)"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Shutter (seconds)"
                  value={tStr}
                  onChange={e => setTStr(e.target.value)}
                  placeholder="15"
                  inputProps={{ inputMode: "decimal" }}
                  helperText="Use decimals (e.g. 0.5 for half a second)"
                />
              </Grid>
            </Grid>
            {k != null && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                Exposure factor (relative): ISO×t/f² ≈ {k.toExponential(4)}
              </Typography>
            )}
          </Paper>

          {baseOk && (
            <>
              <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Same aperture ({fmtF(fn)})
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Shutter time for each ISO to match exposure.
                </Typography>
                <Table size="small" sx={{ "& td": { borderColor: "rgba(255,255,255,0.08)" } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ISO</TableCell>
                      <TableCell align="right">Shutter</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isoRows.map(row => (
                      <TableRow
                        key={row.iso}
                        sx={{
                          bgcolor: row.isBase ? "rgba(124, 184, 255, 0.08)" : "transparent",
                        }}
                      >
                        <TableCell>{row.iso}{row.isBase ? " (base)" : ""}</TableCell>
                        <TableCell align="right">{formatShutterSeconds(row.shutter)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Same ISO ({fmtIso(iso)})
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Shutter time for each f-stop to match exposure.
                </Typography>
                <Table size="small" sx={{ "& td": { borderColor: "rgba(255,255,255,0.08)" } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Aperture</TableCell>
                      <TableCell align="right">Shutter</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fRows.map(row => (
                      <TableRow
                        key={row.f}
                        sx={{
                          bgcolor: row.isBase ? "rgba(124, 184, 255, 0.08)" : "transparent",
                        }}
                      >
                        <TableCell>
                          {fmtF(row.f)}
                          {row.isBase ? " (base)" : ""}
                        </TableCell>
                        <TableCell align="right">{formatShutterSeconds(row.shutter)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Custom match
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Try ISO (same f/)"
                      value={customIso}
                      onChange={e => setCustomIso(e.target.value)}
                      placeholder="3200"
                      helperText={
                        customOutShutter != null
                          ? `Shutter → ${formatShutterSeconds(customOutShutter)}`
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Try shutter in seconds (same f/)"
                      value={customT}
                      onChange={e => setCustomT(e.target.value)}
                      placeholder="30"
                      helperText={
                        customOutIso != null &&
                        Number.isFinite(customOutIso) &&
                        customOutIso > 0 &&
                        customOutIso < 1e9
                          ? `ISO → ${fmtIso(customOutIso)}`
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Try f-number (same ISO)"
                      value={customF}
                      onChange={e => setCustomF(e.target.value)}
                      placeholder="4"
                      helperText={
                        customOutShutterForF != null
                          ? `Shutter → ${formatShutterSeconds(customOutShutterForF)}`
                          : undefined
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}

          {!baseOk && (
            <Typography variant="body2" color="text.secondary">
              Enter positive ISO, f-number, and shutter (seconds).
            </Typography>
          )}

          <Paper elevation={0} sx={{ ...glass, p: { xs: 2.25, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 1.5 }}>
              Limits
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Same brightness math is not the same as same noise, same star streaking, or same depth
              of field. If you are not tracking the sky, still mind your{" "}
              <MuiLink component={Link} href="/tools/500-rule" color="primary.light" fontWeight={600}>
                500 rule
              </MuiLink>{" "}
              or shorten shutter when you crank ISO.
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
              Toy math only. Real cameras get noisy weird at high ISO and the sky changes while you
              sneeze.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
