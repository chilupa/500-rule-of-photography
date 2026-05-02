/** Synodic month in days (mean). */
export const SYNODIC_MONTH = 29.530588853

const PHASE_LABELS = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
]

const PHASE_EMOJI = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]

/**
 * Julian date for instant `date` (UTC-based ms → JD).
 */
export function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5
}

/** Known new moon used as epoch (2000-01-06 18:14 UTC). */
const REF_NEW_MOON_JD = julianDay(new Date(Date.UTC(2000, 0, 6, 18, 14, 0)))

function mod(a, n) {
  return ((a % n) + n) % n
}

/**
 * Moon phase for a calendar night: evaluate at local noon on the picked civil date
 * so the phase stays stable across time zones for “tonight”.
 */
export function getMoonPhase(forDate) {
  const y = forDate.getFullYear()
  const m = forDate.getMonth()
  const d = forDate.getDate()
  const localNoon = new Date(y, m, d, 12, 0, 0, 0)

  const jd = julianDay(localNoon)
  let ageDays = mod(jd - REF_NEW_MOON_JD, SYNODIC_MONTH)

  const fraction = ageDays / SYNODIC_MONTH
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2

  const phaseIndex = Math.min(7, Math.floor(fraction * 8))
  const waxing = fraction < 0.5

  const half = SYNODIC_MONTH / 2
  const daysToNextNew = SYNODIC_MONTH - ageDays
  let daysToNextFull
  if (ageDays <= half) {
    daysToNextFull = half - ageDays
  } else {
    daysToNextFull = SYNODIC_MONTH - ageDays + half
  }

  return {
    fraction,
    ageDays,
    illumination,
    waxing,
    phaseIndex,
    phaseLabel: PHASE_LABELS[phaseIndex],
    phaseEmoji: PHASE_EMOJI[phaseIndex],
    labelIlluminationPct: Math.round(illumination * 1000) / 10,
    localNoon,
    daysToNextNew,
    daysToNextFull,
  }
}

export function skyBrightnessGuide(illumination01) {
  const pct = illumination01 * 100
  if (pct < 8) {
    return {
      band: "Pretty dang dark",
      summary:
        "Moon barely matters. Galaxies and faint junk love nights like this if you get away from town glow.",
      hue: "dark",
    }
  }
  if (pct < 22) {
    return {
      band: "Still mostly chill",
      summary:
        "Skinny moon. Sky stays moody enough that a lot of wide Milky Way stuff still works if your site is actually dark.",
      hue: "good",
    }
  }
  if (pct < 45) {
    return {
      band: "Getting mushy",
      summary:
        "Moonlight starts stealing contrast. Big Milky Way pans can hang on at dark sites, faint fuzz gets cranky.",
      hue: "mid",
    }
  }
  if (pct < 72) {
    return {
      band: "Bright night sky",
      summary:
        "Lots of glare. Dim stuff gets washed out. Fine for the moon itself or bright clusters.",
      hue: "bright",
    }
  }
  return {
    band: "Basically daylight Jr.",
    summary:
      "Fat moon energy. Sky goes milky blue on snow or haze. Lean into moon detail or bright targets. Tiny galaxies need tricks.",
    hue: "veryBright",
  }
}
