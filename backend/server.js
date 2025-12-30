app.set("trust proxy", 1);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL, // your production vercel domain
].filter(Boolean));

const additionalAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

for (const o of additionalAllowedOrigins) allowedOrigins.add(o);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      // allow any vercel preview domains
      if (origin.endsWith(".vercel.app")) return cb(null, true);

      if (allowedOrigins.has(origin)) return cb(null, true);

      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
