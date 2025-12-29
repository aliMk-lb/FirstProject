
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ali-website.vercel.app",
    ];

    // allow Postman/curl (no origin)
    if (!origin) return callback(null, true);

    if (allowed.includes(origin)) return callback(null, true);

    return callback(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
