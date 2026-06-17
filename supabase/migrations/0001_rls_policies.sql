-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current user's UUID from the users table based on Clerk ID
-- Assuming the client sends the clerk_id as a claim, but usually we just use the user_id column 
-- which we'll sync. Actually, it's safer to just rely on the clerk_id matching the JWT.
-- If you use Supabase auth, `auth.uid()` works. Since we use Clerk, we'll need a custom claim 
-- or we use the `request.jwt.claims` if configured. 
-- For simplicity, assuming the auth.uid() is the clerk_id (if we set it up that way) or 
-- we match via a function. Let's assume we map clerk_id to `auth.jwt()->>'sub'`.

CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub' LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = get_current_user_id());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = get_current_user_id());

-- Projects
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (user_id = get_current_user_id() AND deleted_at IS NULL);
CREATE POLICY "Users can create their own projects" ON projects FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (user_id = get_current_user_id());

-- Papers
CREATE POLICY "Users can view their own papers" ON papers FOR SELECT USING (user_id = get_current_user_id() AND deleted_at IS NULL);
CREATE POLICY "Users can create their own papers" ON papers FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own papers" ON papers FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own papers" ON papers FOR DELETE USING (user_id = get_current_user_id());

-- Uploads
CREATE POLICY "Users can view their own uploads" ON uploads FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own uploads" ON uploads FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own uploads" ON uploads FOR UPDATE USING (user_id = get_current_user_id());

-- Annotations
CREATE POLICY "Users can view their own annotations" ON annotations FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own annotations" ON annotations FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own annotations" ON annotations FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own annotations" ON annotations FOR DELETE USING (user_id = get_current_user_id());

-- Highlights
CREATE POLICY "Users can view their own highlights" ON highlights FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own highlights" ON highlights FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own highlights" ON highlights FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own highlights" ON highlights FOR DELETE USING (user_id = get_current_user_id());

-- Notes
CREATE POLICY "Users can view their own notes" ON notes FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own notes" ON notes FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own notes" ON notes FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own notes" ON notes FOR DELETE USING (user_id = get_current_user_id());

-- Bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own bookmarks" ON bookmarks FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks FOR DELETE USING (user_id = get_current_user_id());

-- Conversations
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own conversations" ON conversations FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own conversations" ON conversations FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own conversations" ON conversations FOR DELETE USING (user_id = get_current_user_id());

-- Messages
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own messages" ON messages FOR INSERT WITH CHECK (user_id = get_current_user_id());

-- Reviews
CREATE POLICY "Users can view their own reviews" ON reviews FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (user_id = get_current_user_id());

-- Comparisons
CREATE POLICY "Users can view their own comparisons" ON comparisons FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own comparisons" ON comparisons FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own comparisons" ON comparisons FOR UPDATE USING (user_id = get_current_user_id());
CREATE POLICY "Users can delete their own comparisons" ON comparisons FOR DELETE USING (user_id = get_current_user_id());

-- Activities
CREATE POLICY "Users can view their own activities" ON activities FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own activities" ON activities FOR INSERT WITH CHECK (user_id = get_current_user_id());

-- User Preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING (user_id = get_current_user_id());
CREATE POLICY "Users can create their own preferences" ON user_preferences FOR INSERT WITH CHECK (user_id = get_current_user_id());
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE USING (user_id = get_current_user_id());
