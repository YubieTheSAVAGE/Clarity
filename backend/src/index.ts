import app from "./app.js";
import { env } from "./lib/env.js";

const PORT = parseInt(env.PORT, 10) || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
