
export default function ChartSparkline({ series }: { series: number[] }){
  if(!series || series.length === 0) return <div className="text-slate-400">No data</div>
  const width = 600
  const height = 120
  const max = Math.max(...series)
  const min = Math.min(...series)
  const len = series.length
  const points = series.map((v,i)=>{
    const x = (i/(len-1))*width
    const y = height - ((v - min)/(max - min || 1))*height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28">
      <polyline fill="none" stroke="#7C3AED" strokeWidth={2} points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
