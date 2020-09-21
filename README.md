# Blaseball Blingo

A blingo game about a blaseball game.

This is a project by [@jrfbz](https://twitter.com/jrfbz) and [@spilliams](https://twitter.com/spilliams).

It has one deployment: here, on github pages. This is managed through the CNAME file and some DNS on the domain side.

To test locally, try `python -m http.server`.

Uses Airtable as a data source, with a read-only API key. Falls back to randomized list of default tiles, and falls further back to static list of default tiles (no-js).
