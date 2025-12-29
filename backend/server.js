// ✅ SAFE CORS (never crashes Render)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ali-website.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, health checks
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: do NOT throw errors in Render
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
