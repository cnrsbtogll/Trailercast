# Privacy Policy — TrailCast

Effective date: September 11, 2026
Contact: https://github.com/cnrsbtogll/Trailercast/issues

TrailCast is an offline-first hyperlocal weather + activity journal app.
This policy explains what data the app handles.

## Data stored on your device
- Activity journal entries you create (activity type, time, notes)
- Saved locations and app settings
- Cached weather data (to work offline)

All of the above stays in a local database on your device. We have no
servers and no user accounts, so we never receive or store this data.

## Data sent to third parties
- **Open-Meteo (weather):** when you request weather, your coordinates
  (or a place name you search for) are sent to `api.open-meteo.com` /
  `geocoding-api.open-meteo.com` to fetch the forecast. Open-Meteo
  requires no API key and no account. We do not combine this with any
  identity — there is none.
- **Nothing else.** No advertising SDKs, no analytics SDKs, no crash
  reporters, no social logins.

## Permissions
- **Location (when in use):** used only to fetch weather for your current
  spot. Your location is never stored on a server and never shared with
  anyone except Open-Meteo for the forecast request described above.

## Children
The app collects no personal data from anyone, including children.

## Changes
If the app's data handling changes, this policy will be updated in the
repository before the corresponding release.
