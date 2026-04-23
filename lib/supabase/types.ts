// Generiert basierend auf SPEC-v3.md Datenmodell
// Produktiv: `supabase gen types typescript --linked` verwenden

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          pflegegrad: 1 | 2 | 3 | 4 | 5 | null
          bundesland: string
          wohnsituation: 'zuhause' | 'wg' | 'heim' | null
          versicherung: string | null
          pflegegrad_seit: string | null
          nutzt_pflegedienst: boolean
          is_premium: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'],
          'created_at' | 'updated_at' | 'is_premium' | 'nutzt_pflegedienst'
        > & {
          created_at?: string
          updated_at?: string
          is_premium?: boolean
          nutzt_pflegedienst?: boolean
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }

      benefit_types: {
        Row: {
          id: string
          name: string
          slug: string
          paragraph_sgb: string | null
          description: string | null
          short_description: string | null
          icon: string | null
          per_pflegegrad: Record<string, number>
          frequency: 'monthly' | 'yearly' | 'once'
          deadline_rule: string | null
          requires_antrag: boolean
          category: 'geld' | 'sach' | 'sonstig' | null
          info_url: string | null
          tip: string | null
          active_from: string | null
          active_to: string | null
        }
        Insert: Omit<Database['public']['Tables']['benefit_types']['Row'], 'id' | 'requires_antrag'> & {
          id?: string
          requires_antrag?: boolean
        }
        Update: Partial<Database['public']['Tables']['benefit_types']['Row']>
      }

      budgets: {
        Row: {
          id: string
          user_id: string
          benefit_type_id: string
          year: number
          total_cents: number
          used_cents: number
          expires_at: string | null
          status: 'active' | 'expiring' | 'expired'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['budgets']['Row'],
          'id' | 'used_cents' | 'status' | 'created_at'
        > & {
          id?: string
          used_cents?: number
          status?: 'active' | 'expiring' | 'expired'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['budgets']['Row']>
      }

      transactions: {
        Row: {
          id: string
          budget_id: string
          amount_cents: number
          description: string | null
          receipt_url: string | null
          provider_name: string | null
          date: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['transactions']['Row']>
      }

      notifications: {
        Row: {
          id: string
          user_id: string
          budget_id: string | null
          type:
            | 'reminder_90d'
            | 'reminder_30d'
            | 'reminder_7d'
            | 'expired'
            | 'tip_umwandlung'
            | 'tip_hilfsmittel'
            | 'tip_hoeherstufung'
            | 'yearly_update'
            | 'welcome'
          title: string
          body: string | null
          sent_at: string | null
          read_at: string | null
          channel: 'email' | 'push' | 'in_app'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }

      providers: {
        Row: {
          id: string
          name: string
          address: string | null
          plz: string | null
          ort: string | null
          bundesland: string | null
          lat: number | null
          lng: number | null
          services: string[] | null
          kassen_zugelassen: boolean
          phone: string | null
          website: string | null
          verified: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['providers']['Row'],
          'id' | 'kassen_zugelassen' | 'verified' | 'created_at'
        > & {
          id?: string
          kassen_zugelassen?: boolean
          verified?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['providers']['Row']>
      }

      applications: {
        Row: {
          id: string
          user_id: string
          benefit_type_id: string | null
          type:
            | 'entlastung'
            | 'verhinderung'
            | 'kurzzeitpflege'
            | 'wohnumfeld'
            | 'pflegehilfsmittel'
            | 'hoeherstufung'
            | 'widerspruch'
          status: 'entwurf' | 'eingereicht' | 'genehmigt' | 'abgelehnt'
          pdf_url: string | null
          notes: string | null
          submitted_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['applications']['Row'],
          'id' | 'status' | 'created_at'
        > & {
          id?: string
          status?: 'entwurf' | 'eingereicht' | 'genehmigt' | 'abgelehnt'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['applications']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience-Typen
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BenefitType = Database['public']['Tables']['benefit_types']['Row']
export type Budget = Database['public']['Tables']['budgets']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Provider = Database['public']['Tables']['providers']['Row']
export type Application = Database['public']['Tables']['applications']['Row']

export type Pflegegrad = 1 | 2 | 3 | 4 | 5
