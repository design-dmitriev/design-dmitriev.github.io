# Telegram feed

Refresh locally from repository root: `node scripts/update-telegram.cjs`.
Reads only public https://t.me/s/wtf_starlight. No bot token or account login.
Latest 3 supported non-service posts, including text-only posts. For albums only the first image is shown. Video/sticker-only posts without public text/photo are not displayed. Post excerpts are escaped, never injected as source HTML.
Images are copied locally because Telegram CDN links may expire. Existing feed is preserved when response parsing or downloads fail. The public HTML format is not an official stable API and may require parser maintenance.

Prepared workflow: .github/workflows/telegram-feed.yml. NOT activated/published yet.
When user authorizes publishing: merge to default branch, set repository Pages source to GitHub Actions, permit workflow writes, run Refresh Telegram blog manually and verify deployment. This workflow replaces branch-based Pages publishing; coordinate existing deployment before enabling. Schedule requests hourly at minute 23 UTC; GitHub can delay scheduled runs. Local preview does not poll Telegram automatically.
