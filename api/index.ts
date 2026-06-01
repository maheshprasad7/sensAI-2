// Vercel Serverless Function Entry Point
// This file re-exports the Express app so Vercel can serve all /api/* routes as serverless functions

import app from "../server";

export default app;
