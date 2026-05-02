const MM_PER_IN = 25.4

export function megapixelsFromPixels(w, h) {
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null
  return (w * h) / 1e6
}

export function printSizeInches(pxW, pxH, dpi) {
  if (!Number.isFinite(dpi) || dpi <= 0) return null
  return { widthIn: pxW / dpi, heightIn: pxH / dpi }
}

export function inchesToMm(inches) {
  return inches * MM_PER_IN
}

/** Pixels required to print width×height inches at native dpi (each dimension). */
export function pixelsForPrintSize(widthIn, heightIn, dpi) {
  if (
    !Number.isFinite(widthIn) ||
    !Number.isFinite(heightIn) ||
    widthIn <= 0 ||
    heightIn <= 0 ||
    !Number.isFinite(dpi) ||
    dpi <= 0
  ) {
    return null
  }
  return {
    widthPx: Math.ceil(widthIn * dpi),
    heightPx: Math.ceil(heightIn * dpi),
  }
}

/** Effective DPI if an image of pxW×pxH is printed at widthIn×heightIn (may differ per axis). */
export function effectiveDpi(pxW, pxH, widthIn, heightIn) {
  if (
    !Number.isFinite(pxW) ||
    !Number.isFinite(pxH) ||
    pxW <= 0 ||
    pxH <= 0 ||
    !Number.isFinite(widthIn) ||
    !Number.isFinite(heightIn) ||
    widthIn <= 0 ||
    heightIn <= 0
  ) {
    return null
  }
  return {
    dpiX: pxW / widthIn,
    dpiY: pxH / heightIn,
  }
}
