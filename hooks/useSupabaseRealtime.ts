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
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uploads' },
        (payload) => {
          // Invalidate any upload queries or related paper queries
          queryClient.invalidateQueries({ queryKey: ["uploads"] })
          // If status completed, a new paper was created probably
          if (payload.new && (payload.new as any).status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ["papers"] })
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'papers' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["papers"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["messages"] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])
}
