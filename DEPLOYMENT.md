# Deployment Checklist

This is a **static website**; it does **not** use Streamlit and it needs no backend hosting or credentials.

## GitHub Pages

1. On GitHub, create a repository named `AeroPulse` (public).
2. Upload all files and directories from the extracted project folder into the root of that repository.
3. Commit to the `main` branch.
4. Go to **Settings → Pages** and select **Deploy from a branch**, `main`, `/(root)`.
5. After publishing, open the link shown in GitHub Pages settings and check that the dashboard loads.
6. Verify that the Passenger Explorer year selector, forecast horizon slider and scenario sliders work, and export one CSV.
7. Add the verified live URL to the README, GitHub website field, resume and LinkedIn.

## Alternative: Netlify Drop

Use https://app.netlify.com/drop to upload the **unzipped folder**. Check the generated URL and verify the buttons.

## Files essential for production

`index.html`, `styles.css`, `app.js`, `analytics.js`, `assets/favicon.svg`, `data/airport-data.js`.

CSV snapshots, scripts, tests and documentation are useful portfolio proof but are not required to render the web UI.

## Known limits

- Historical snapshot, not live airline data.
- No real-time flights, delayed flights, gates, crew rosters, or arrivals/departures feed.
- Browser support: modern Chrome, Edge, Safari or Firefox with modern JavaScript support.
- Works without internet; opening HTML directly works because bundled dataset is a JS file, not an AJAX request.

