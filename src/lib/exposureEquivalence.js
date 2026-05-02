/**
 * Photometric exposure ~ ISO × t / N² (t seconds, N = f-number).
 * Equivalent combinations keep ISO×t/N² constant (same scene & brightness model).
 */

export function exposureFactor(iso, tSec, fNumber) {
  if (
    !Number.isFinite(iso) ||
    !Number.isFinite(tSec) ||
    !Number.isFinite(fNumber) ||
    iso <= 0 ||
    tSec <= 0 ||
    fNumber <= 0
  ) {
    return null
  }
  return (iso * tSec) / (fNumber * fNumber)
}

/** Shutter for equivalent exposure at same aperture. */
export function shutterForIso(baseIso, baseT, baseN, newIso, newN = baseN) {
  const k = exposureFactor(baseIso, baseT, baseN)
  if (k == null || !Number.isFinite(newIso) || !Number.isFinite(newN) || newIso <= 0 || newN <= 0)
    return null
  return (k * newN * newN) / newIso
}

/** ISO for equivalent exposure at same aperture and shutter ratio. */
export function isoForShutter(baseIso, baseT, baseN, newT, newN = baseN) {
  const k = exposureFactor(baseIso, baseT, baseN)
  if (k == null || !Number.isFinite(newT) || !Number.isFinite(newN) || newT <= 0 || newN <= 0)
    return null
  return (k * newN * newN) / newT
}

/** Aperture for equivalent exposure at same ISO and shutter ratio. */
export function apertureForShutter(baseIso, baseT, baseN, newT, newIso = baseIso) {
  const k = exposureFactor(baseIso, baseT, baseN)
  if (k == null || !Number.isFinite(newT) || !Number.isFinite(newIso) || newT <= 0 || newIso <= 0)
    return null
  return Math.sqrt((newIso * newT) / k)
}

export function formatShutterSeconds(sec) {
  if (sec == null || !Number.isFinite(sec) || sec <= 0) return "-"
  if (sec >= 100) return `${Math.round(sec)} s`
  if (sec >= 1) return `${Number(sec.toFixed(sec >= 10 ? 0 : 2))} s`
  const inv = 1 / sec
  if (inv >= 2 && inv < 16000) return `1/${Math.round(inv)} s`
  return `${sec.toPrecision(3)} s`
}
