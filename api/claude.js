// Tiny proxy: the browser calls /api/claude, this adds your secret API key
// server-side and forwards to Anthropic. The key never reaches the browser.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: payload
    });
    const text = await r.text();
    res.status(r.status).setHeader("Content-Type", "application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
