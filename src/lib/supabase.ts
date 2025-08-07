import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kiểm tra credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Missing Supabase credentials. Please check your .env file.')
}

// Kiểm tra xem có phải đang sử dụng placeholder URLs không
const isPlaceholder = supabaseUrl.includes('placeholder') || 
  supabaseAnonKey.includes('placeholder')

if (isPlaceholder) {
  console.warn('🔧 Development Mode: Sử dụng mock Supabase client vì chưa cấu hình credentials thực tế')
  console.warn('📝 Để sửa lỗi này, hãy cập nhật file .env với Supabase credentials thực tế')
} else {
  console.log('✅ Production Mode: Kết nối với Supabase database thực tế')
  console.log('🔗 Supabase URL:', supabaseUrl)
}

// Tạo mock client cho development mode
const createMockClient = () => {
  const mockResponse = { data: null, error: null }
  const mockQueryBuilder = {
    select: function() { return this },
    insert: function() { return this },
    update: function() { return this },
    delete: function() { return this },
    eq: function() { return this },
    neq: function() { return this },
    gt: function() { return this },
    gte: function() { return this },
    lt: function() { return this },
    lte: function() { return this },
    like: function() { return this },
    ilike: function() { return this },
    is: function() { return this },
    in: function() { return this },
    contains: function() { return this },
    containedBy: function() { return this },
    rangeGt: function() { return this },
    rangeGte: function() { return this },
    rangeLt: function() { return this },
    rangeLte: function() { return this },
    rangeAdjacent: function() { return this },
    overlaps: function() { return this },
    textSearch: function() { return this },
    match: function() { return this },
    not: function() { return this },
    or: function() { return this },
    filter: function() { return this },
    order: function() { return this },
    limit: function() { return this },
    range: function() { return this },
    abortSignal: function() { return this },
    single: function() { return this },
    maybeSingle: function() { return this },
    csv: function() { return this },
    geojson: function() { return this },
    explain: function() { return this },
    rollback: function() { return this },
    returns: function() { return this },
    then: function(resolve) {
      // Trả về Promise với dữ liệu mock
      return Promise.resolve({ data: [], error: null }).then(resolve)
    },
    catch: function(reject) {
      return Promise.resolve({ data: [], error: null }).catch(reject)
    }
  }
  
  const mockAuth = {
    signUp: async () => mockResponse,
    signInWithPassword: async () => mockResponse,
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => mockResponse,
    updateUser: async () => mockResponse,
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback) => {
      // Mock auth state change listener
      setTimeout(() => {
        callback('SIGNED_OUT', null)
      }, 100)
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },
    refreshSession: async () => ({ data: { session: null }, error: null }),
    setSession: async () => ({ data: { session: null }, error: null })
  }
  
  return {
    auth: mockAuth,
    from: () => mockQueryBuilder,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    rpc: async () => ({ data: null, error: null }),
    channel: () => ({
      on: () => ({}),
      subscribe: () => ({}),
      unsubscribe: () => ({})
    })
  }
}

export const supabase = isPlaceholder 
  ? createMockClient() as any
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  getSession: () => {
    return supabase.auth.getSession()
  }
}