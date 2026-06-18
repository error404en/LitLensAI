"use client";

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createClient } from "../lib/supabase/client"
import { useAuth } from "@clerk/nextjs"

export function useSupabaseRealtime() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  useEffect(() => {
    if (!userId) return
    
    const supabase = createClient()
    
    // Use a unique channel name to prevent "cannot add callbacks after subscribe()" in StrictMode
    const channelName = `schema-db-changes-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uploads' },
        (payload) => {
          // Invalidate any upload queries or related paper queries
          queryClient.invalidateQueries({ queryKey: ["uploads"] })
          // If status completed, a new paper was created probably
          if (payload.new && (payload.new as { status?: string }).status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ["papers"] })
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'papers' },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ["papers"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ["messages"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])
}
