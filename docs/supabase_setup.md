# Supabase Setup Guide

SeatSeek uses Supabase for PostgreSQL database and future authentication services.

## Schema Setup

1. Go to the [Supabase Dashboard](https://app.supabase.com/).
2. Create a new project.
3. Open the **SQL Editor**.
4. Copy and paste the contents of `supabase_schema.sql` (found in the project root or artifact) into the editor.
5. Click **Run**.

## Environment Variables

Add the following to your `server/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Scalability Considerations

- **Row Level Security (RLS)**: Ensure RLS is enabled on the `users` and `saved_searches` tables.
- **Real-time**: Enable the "Real-time" replication for the `coach_density` table to support live dashboard updates via WebSockets in the future.
- **Indexes**: The schema includes indexes on `train_no` for faster lookups.
