# Photographer’s toolkit

Little astro helpers that run in the browser. There’s a 500 rule calculator for star trails, plus moon phase, golden or blue hour timing, print size or DPI math, exposure equivalence, and more stuff over time. Dark UI, fine on a phone next to the tripod.

## What’s in here

- **500 rule** max shutter before trails, by crop and focal length
- **Moon phase** rough sky brightness vibes for planning nights out
- **Sun hours** blue and golden windows from lat long
- **Print size** megapixels vs inches and DPI
- **Exposure equivalence** swap ISO, aperture, shutter while staying close on brightness

Built with Next.js, MUI, Framer Motion. Static export friendly if you want to host it anywhere boring.

## Try it

There’s a [demo on Amplify](https://develop.d3h3dygshkjxg9.amplifyapp.com/) if you want to poke around without cloning.

## Local dev

```bash
npm install
npm run dev
```

Production build (also writes static files under `out/` when `output: export` is set):

```bash
npm run build
```

GitHub Pages style deploy:

```bash
npm run deploy
```

## 500 rule in one sentence

Pick sensor crop and focal length, get a ballpark max shutter before stars smear: `500 ÷ (focal length × crop factor)`. Earth spins, your tripod doesn’t, so this is a rule of thumb not a law of physics.

## Sensors we crop for

Full frame (1×), Canon APS C (1.6×), Nikon or Sony APS C (1.5×), Micro Four Thirds (2×).
