export default function BlogLoading() {
  return (
    <div className='mx-auto max-w-[1200px] px-6 py-20 md:px-7'>
      <div className='mb-10 text-center'>
        <div className='mx-auto mb-2 h-3 w-16 animate-pulse rounded-full bg-[#e8e2d9]' />
        <div className='mx-auto mb-2 h-12 w-[300px] animate-pulse rounded-[10px] bg-[#e8e2d9]' />
        <div className='mx-auto h-4 w-[400px] animate-pulse rounded-[8px] bg-[#e8e2d9]' />
      </div>

      <div className='mx-auto mb-10 max-w-[500px]'>
        <div className='h-12 w-full animate-pulse rounded-[12px] bg-[#e8e2d9]' />
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='overflow-hidden rounded-[14px] border border-[#e8e2d9] bg-white'
          >
            <div className='h-[180px] animate-pulse bg-[#e8e2d9]' />
            <div className='p-5'>
              <div className='mb-2 h-4 w-16 animate-pulse rounded-[6px] bg-[#e8e2d9]' />
              <div className='mb-2 h-5 w-full animate-pulse rounded-[6px] bg-[#e8e2d9]' />
              <div className='mb-2 h-5 w-[90%] animate-pulse rounded-[6px] bg-[#e8e2d9]' />
              <div className='h-4 w-[60%] animate-pulse rounded-[6px] bg-[#e8e2d9]' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
