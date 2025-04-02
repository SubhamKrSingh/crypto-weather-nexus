export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="relative">
        <div className="absolute animate-ping opacity-75 rounded-full h-16 w-16 border-4 border-purple-500/20"></div>
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
      </div>
      <div className="animate-pulse mt-4 text-sm font-medium text-gray-400">Loading data...</div>
    </div>
  );
} 