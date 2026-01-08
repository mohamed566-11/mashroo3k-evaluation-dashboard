import { createClient } from '@supabase/supabase-js'

// TODO: استبدل هذه القيم بقيم Supabase الخاصة بك
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Functions للتعامل مع البيانات
export const getEvaluations = async () => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getEvaluationsStats = async () => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
  
  if (error) throw error
  
  if (!data || data.length === 0) {
    return {
      total: 0,
      averages: {
        investor_rep: 0,
        advisory_team: 0,
        output_quality: 0,
        website_exp: 0
      },
      recommendRate: 0,
      recentCount: 0
    }
  }
  
  const total = data.length
  const averages = {
    investor_rep: data.reduce((sum, e) => sum + e.investor_rep_rating, 0) / total,
    advisory_team: data.reduce((sum, e) => sum + e.advisory_team_rating, 0) / total,
    output_quality: data.reduce((sum, e) => sum + e.output_quality_rating, 0) / total,
    website_exp: data.reduce((sum, e) => sum + e.website_exp_rating, 0) / total
  }
  
  const recommendCount = data.filter(e => e.will_recommend).length
  const recommendRate = (recommendCount / total) * 100
  
  // آخر 7 أيام
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentCount = data.filter(e => new Date(e.created_at) >= sevenDaysAgo).length
  
  return {
    total,
    averages,
    recommendRate,
    recentCount
  }
}

export const getEvaluationsByDate = async () => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('created_at, investor_rep_rating, advisory_team_rating, output_quality_rating, website_exp_rating')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const getReasonsDistribution = async () => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('reason, other_reason')
  
  if (error) throw error
  
  const distribution = {}
  data.forEach(e => {
    const reason = e.reason === 'أخرى' && e.other_reason ? e.other_reason : e.reason
    distribution[reason] = (distribution[reason] || 0) + 1
  })
  
  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

