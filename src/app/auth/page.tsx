import Link from 'next/link'
import AuthUI from './AuthUI'

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const p = await searchParams;

  return (
    <main className="min-h-screen bg-[#1F1E24] flex items-center justify-center p-6">
      {/* The main container matching the reference image layout */}
      <div className="w-full max-w-[1000px] h-auto min-h-[640px] bg-[#222129] rounded-[24px] shadow-2xl flex border border-white/5 overflow-hidden">
        
        {/* Left side: Image and branding */}
        <div className="w-[45%] relative p-8 flex-col justify-between hidden md:flex border-r border-[#1F1E24]">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover rounded-l-[24px]"
          >
            <source src="/login-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#222129]/60 rounded-l-[24px] backdrop-blur-sm" /> {/* overlay with slight blur for text legibility */}
          
          <div className="relative z-10 flex justify-between items-center w-full">
            <Link href="/" className="font-bold text-white text-xl tracking-wider hover:opacity-80 transition-opacity">
              AURA
            </Link>
            <Link href="/" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 text-xs px-4 py-1.5 rounded-full transition-colors flex items-center gap-1 font-medium border border-white/10">
              Back to website <span className="transform translate-y-[0.5px]">&rarr;</span>
            </Link>
          </div>

          <div className="relative z-10 w-full mb-4">
            <h2 className="text-white text-[28px] leading-snug font-semibold mb-8">
              Capturing keystrokes,<br />Creating experiences.
            </h2>
            <div className="flex gap-2.5">
              <div className="w-8 h-1 bg-white rounded-full"></div>
              <div className="w-3 h-1 bg-white/30 rounded-full"></div>
              <div className="w-3 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right side: Form area */}
        <div className="w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center relative">
          <AuthUI error={p?.error} />
        </div>
        
      </div>
    </main>
  )
}
