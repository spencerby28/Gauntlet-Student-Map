# Guantlet Student Map

Tracking where everyone's coming from before we all end up in Austin. Built with SvelteKit + Appwrite.

Live at [gauntlet.sb28.xyz](https://gauntlet.sb28.xyz). Login with Discord.

## Run it locally

```bash
# Get the code
git clone https://github.com/spencerby28/Gauntlet-Student-Map && cd gauntlet
npm install

# Set up your env
cp .env.example .env

# Fire it up
npm dev
```
## Stack

- SvelteKit for the frontend magic
- Appwrite handling the backend heavy lifting
- D3 making things pretty on maps

## Features

✅ Done:
- US map with migration paths
- Discord auth
- Current location + hometown tracking
- Real-time updates
- Countdown to ATX
- City autocomplete

🚧 Coming up:
- Restrict Access to Discord Users in Unofficial Discord
- Globe view
- Stats dashboard

## Contributing

1. Branch off main
2. Do your thing
3. PR it
4. Auto-deploys to Vercel for preview
5. Gets merged, ships to prod

That's it. Let's build.
