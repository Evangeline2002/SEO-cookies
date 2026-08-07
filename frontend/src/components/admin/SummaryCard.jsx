export default function SummaryCard({ title, value, icon: Icon, trend, color = 'text-[#8B4513]' }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:shadow-gray-200/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
    </div>
  );
}
