"use client";

import * as React from "react";
import { createClient } from "../../../lib/supabase/client";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = React.useState<string>("system");
  const [citationFormat, setCitationFormat] = React.useState<string>("apa");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = React.useMemo(() => createClient(), []);

  // Fetch current preferences
  React.useEffect(() => {
    async function loadPreferences() {
      try {
        setIsLoading(true);
        // Fetch current user UUID
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .single();

        if (userError || !userData) {
          throw new Error("Failed to load user profile. Make sure you are signed in.");
        }

        const userId = userData.id;

        // Fetch preferences
        const { data: prefs, error: prefsError } = await supabase
          .from("user_preferences")
          .select("theme, citation_format")
          .eq("user_id", userId)
          .maybeSingle();

        if (prefsError) {
          throw prefsError;
        }

        if (prefs) {
          setTheme(prefs.theme || "system");
          setCitationFormat(prefs.citation_format || "apa");
        } else {
          // Create initial defaults
          const { error: insertError } = await supabase
            .from("user_preferences")
            .insert({
              user_id: userId,
              theme: "system",
              citation_format: "apa",
            });
          if (insertError) console.warn("Failed to create default preferences:", insertError);
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to load preferences",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [supabase]);

  // Apply theme class to HTML element
  const applyTheme = (selectedTheme: string) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.add("light");
    } else {
      // System
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .single();

      if (userError || !userData) {
        throw new Error("User profile not found.");
      }

      const { error: saveError } = await supabase
        .from("user_preferences")
        .upsert(
          {
            user_id: userData.id,
            theme,
            citation_format: citationFormat,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (saveError) throw saveError;

      // Apply theme changes immediately in the DOM
      applyTheme(theme);

      setMessage({ type: "success", text: "Preferences saved successfully!" });
    } catch (err) {
      console.error("Error saving preferences:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save preferences",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 max-w-4xl mx-auto w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your personal workspace preferences and configurations.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 border text-sm transition-all duration-150 ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Settings Cards */}
          <div className="grid gap-6">
            {/* Theme Preference Card */}
            <div className="bg-surface/50 border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Appearance Theme</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose how LitLens AI looks on your screen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "light", label: "Light Mode", icon: "light_mode" },
                  { value: "dark", label: "Dark Mode", icon: "dark_mode" },
                  { value: "system", label: "System Sync", icon: "desktop_windows" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-surface-variant/30 ${
                      theme === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant text-muted-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={option.value}
                      checked={theme === option.value}
                      onChange={(e) => setTheme(e.target.value)}
                      className="sr-only"
                    />
                    <span className="material-symbols-outlined text-[28px] mb-2">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Citation Preference Card */}
            <div className="bg-surface/50 border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Default Citation Format</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set your preferred reference style for AI generation and paper logs.
                </p>
              </div>

              <div className="space-y-2">
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full sm:max-w-xs rounded-md border border-outline-variant bg-surface px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-on-surface"
                >
                  <option value="apa">APA (American Psychological Association)</option>
                  <option value="mla">MLA (Modern Language Association)</option>
                  <option value="chicago">Chicago Manual of Style</option>
                  <option value="harvard">Harvard referencing style</option>
                  <option value="ieee">IEEE (Institute of Electrical and Electronics Engineers)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/95 disabled:opacity-50 min-w-[120px] transition-all cursor-pointer shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-primary-foreground" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
