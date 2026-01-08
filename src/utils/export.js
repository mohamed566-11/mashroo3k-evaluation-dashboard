export const exportToCSV = (data, filename = 'evaluations') => {
  if (!data || data.length === 0) {
    return
  }

  // Headers
  const headers = [
    'الاسم',
    'البريد الإلكتروني',
    'الهاتف',
    'ممثل المستثمر',
    'الفريق الاستشاري',
    'جودة المخرجات',
    'تجربة الموقع',
    'التوصية',
    'السبب',
    'سبب آخر',
    'التاريخ'
  ]

  // Convert data to CSV rows
  const rows = data.map(item => [
    item.name || '',
    item.email || '',
    item.phone || '',
    item.investor_rep_rating || '',
    item.advisory_team_rating || '',
    item.output_quality_rating || '',
    item.website_exp_rating || '',
    item.will_recommend ? 'نعم' : 'لا',
    item.reason || '',
    item.other_reason || '',
    new Date(item.created_at).toLocaleDateString('ar-EG')
  ])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Add BOM for Arabic support
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

