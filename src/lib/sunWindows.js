import SunCalc from "suncalc"

function okDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime())
}

function windowFrom(times, startKey, endKey) {
  const start = times[startKey]
  const end = times[endKey]
  if (!okDate(start) || !okDate(end)) return null
  return {
    start,
    end,
    durationMs: end - start,
  }
}

/**
 * Civil twilight & soft-light windows for a spot on Earth.
 * Uses SunCalc’s angles: ±6° for blue hour edges; +6° / horizon for golden hour.
 *
 * @param {number} latDeg
 * @param {number} lonDeg
 * @param {Date} dateLocalNoon local noon on the calendar day you care about (same idea as moon-phase).
 */
export function getSunWindows(latDeg, lonDeg, dateLocalNoon) {
  const times = SunCalc.getTimes(dateLocalNoon, latDeg, lonDeg)

  return {
    solarNoon: okDate(times.solarNoon) ? times.solarNoon : null,
    sunrise: okDate(times.sunrise) ? times.sunrise : null,
    sunset: okDate(times.sunset) ? times.sunset : null,
    /** Civil twilight before sunrise (−6° → horizon). */
    morningBlue: windowFrom(times, "dawn", "sunrise"),
    /** Warm low sun after sunrise (horizon → +6°). */
    morningGolden: windowFrom(times, "sunrise", "goldenHourEnd"),
    /** Warm low sun before sunset (+6° → horizon). */
    eveningGolden: windowFrom(times, "goldenHour", "sunset"),
    /** Civil twilight after sunset (horizon → −6°). */
    eveningBlue: windowFrom(times, "sunset", "dusk"),
  }
}

export function formatDuration(ms) {
  if (ms == null || ms < 0 || !Number.isFinite(ms)) return "-"
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h <= 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}
