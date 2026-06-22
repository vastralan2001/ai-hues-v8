export default function ToolsLoading() {
  return (
    <div className='mx-auto max-w-[900px] px-6 py-20 md:px-7'>
      <div className='mb-8 h-10 w-[200px] animate-pulse rounded-[10px] bg-[#e8e2d9]' />
      <div className='mb-4 h-4 w-full max-w-[600px] animate-pulse rounded-[8px] bg-[#e8e2d9]' />
      <div className='mb-10 h-4 w-[400px] animate-pulse rounded-[8px] bg-[#e8e2d9]' />

      <div className='space-y-4'>
        <div className='h-[200px] w-full animate-pulse rounded-[14px] bg-[#e8e2d9]' />
        <div className='flex gap-3'>
          <div className='h-10 w-24 animate-pulse rounded-[10px] bg-[#e8e2d9]' />
          <div className='h-10 w-24 animate-pulse rounded-[10px] bg-[#e8e2d9]' />
        </div>
        <div className='h-[120px] w-full animate-pulse rounded-[14px] bg-[#e8e2d9]' />
      </div>
    </div>
  );
}
