import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create storage buckets on startup
const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create avatars bucket if it doesn't exist
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    if (!avatarBucketExists) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log('Created avatars bucket');
    }
    
    // Create event-images bucket if it doesn't exist
    const eventImagesBucketExists = buckets?.some(bucket => bucket.name === 'event-images');
    if (!eventImagesBucketExists) {
      await supabase.storage.createBucket('event-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log('Created event-images bucket');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ce617133/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);