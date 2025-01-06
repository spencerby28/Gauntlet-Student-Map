# Guantlet-Students

Tracking where everyone's coming from before we all end up in Austin. Built with SvelteKit + Appwrite.

Live at [gauntlet.sb28.xyz](https://gauntlet.sb28.xyz). Login with Discord.

## Run it locally

```bash
# Get the code
git clone <repo-url> && cd gauntlet
pnpm install

# Set up your env
cp .env.example .env
# Fill in your Appwrite and Discord creds

# Fire it up
pnpm dev
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
- Globe view
- Stats dashboard

## Contributing

1. Branch off main
2. Do your thing
3. PR it
4. Auto-deploys to Vercel for preview
5. Gets merged, ships to prod

That's it. Let's build.
