import React from "react"
import Head from "next/head"
import Link from "next/link"
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
} from "@mui/material"
import PageShell from "../src/components/PageShell/PageShell"
import { TOOLKIT_ITEMS } from "../src/constants/toolkit"
import { glass } from "../src/styles/surfaces"

function sortToolkitLiveFirst(items) {
  return [...items].sort((a, b) => {
    const rank = status => (status === "live" ? 0 : 1)
    return rank(a.status) - rank(b.status)
  })
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Photographer's toolkit for astro</title>
        <meta
          name="description"
          content="Small astro calculators that run on your phone: 500 rule, moon phase, golden hour, print math, and more."
        />
      </Head>

      <PageShell>
        <Stack spacing={{ xs: 4, sm: 5 }} alignItems="stretch">
          <Box component="header" textAlign="center">
            <Typography
              variant="overline"
              sx={{
                display: "block",
                color: "primary.light",
                mb: 1.5,
                opacity: 0.95,
              }}
            >
              Astro toolkit
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background:
                  "linear-gradient(125deg, #ffffff 0%, #d4e8ff 38%, #7CB8FF 72%, #6BA8F8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Night sky, nailed exposure
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                mx: "auto",
                mb: 2.5,
              }}
            >
              Little tools for night shooters. Think 500 rule for sharp stars,
              plus moon phase, sun windows, print sizes, and stuff still in the
              works. Meant to read fast on your phone out by the tripod.
            </Typography>
          </Box>

          <Box component="section" aria-labelledby="toolkit-heading">
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              <Typography
                id="toolkit-heading"
                variant="h6"
                component="h2"
                sx={{ color: "text.primary" }}
              >
                Essential tools
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Everything runs in the browser. No logins, no uploads, and it
                still works when your signal is trash.
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {sortToolkitLiveFirst(TOOLKIT_ITEMS).map(item => (
                <Grid item xs={12} sm={6} key={item.title}>
                  <Card
                    elevation={0}
                    component={item.href ? Link : "div"}
                    href={item.href}
                    sx={{
                      height: "100%",
                      ...glass,
                      borderRadius: 2,
                      overflow: "hidden",
                      transition:
                        "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                      border:
                        item.status === "live"
                          ? "1px solid rgba(124, 184, 255, 0.35)"
                          : "1px solid rgba(255, 255, 255, 0.09)",
                      textDecoration: "none",
                      display: "block",
                      color: "inherit",
                      ...(item.href
                        ? {
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 14px 48px rgba(0, 0, 0, 0.45)",
                              borderColor:
                                item.status === "live"
                                  ? "rgba(124, 184, 255, 0.5)"
                                  : "rgba(255, 255, 255, 0.14)",
                            },
                          }
                        : {
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 14px 48px rgba(0, 0, 0, 0.45)",
                              borderColor: "rgba(255, 255, 255, 0.14)",
                            },
                          }),
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                        p: 2.25,
                        "&:last-child": { pb: 2.25 },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Typography
                          variant="subtitle1"
                          component="h3"
                          sx={{ color: "text.primary", pr: 1 }}
                        >
                          {item.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={item.status === "live" ? "Live" : "Soon"}
                          sx={{
                            flexShrink: 0,
                            height: 26,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            ...(item.status === "live"
                              ? {
                                  bgcolor: "rgba(124, 184, 255, 0.2)",
                                  color: "primary.light",
                                  border: "1px solid rgba(124, 184, 255, 0.35)",
                                }
                              : {
                                  bgcolor: "rgba(255, 255, 255, 0.05)",
                                  color: "text.secondary",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                }),
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1 }}
                      >
                        {item.description}
                      </Typography>
                      {item.href && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "primary.light",
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Open →
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            component="footer"
            sx={{
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.07)",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" component="p">
              When it really counts, double check with your camera and the sky you
              actually have.
            </Typography>
          </Box>
        </Stack>
      </PageShell>
    </>
  )
}
