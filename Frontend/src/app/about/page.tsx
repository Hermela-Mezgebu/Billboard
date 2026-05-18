"use client";

export default function AboutPage() {
  return (
    <div className="pt-[10rem] pb-[5rem] bg-[#0A192F] text-gray-200 min-h-screen">
      <div className="relative overflow-hidden mx-6 lg:mx-20">
        <div className="max-w-7xl mx-auto border border-gray-700">
          
          {/* LEFT CONTENT */}
          <div className="relative z-10 pb-8 bg-[#112240] sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            
            {/* SHAPE */}
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-[#0A192F] transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polygon points="50,0 100,0 50,100 0,100"></polygon>
            </svg>

            <div className="pt-1"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                
                <h2 className="my-6 text-2xl tracking-tight font-semibold text-white sm:text-3xl md:text-4xl">
                  About Et-Sonic
                </h2>

                <p className="pr-4 text-gray-400 leading-relaxed">
                  Donec porttitor, enim ut dapibus lobortis, lectus sem tincidunt
                  dui, eget ornare lectus ex non libero. Nam rhoncus diam ultrices
                  porttitor laoreet. Ut mollis fermentum ex, vel viverra lorem
                  volutpat sodales. In ornare porttitor odio sit amet laoreet.
                  Sed laoreet, nulla a posuere ultrices, purus nulla tristique
                  turpis, hendrerit rutrum augue quam ut est. Fusce malesuada
                  posuere libero, vitae dapibus eros facilisis euismod.
                  Sed sed lobortis justo, ut tincidunt velit. Mauris in maximus eros.
                </p>

              </div>
            </main>
          </div>
        </div>

        {/* RIGHT VIDEO (replaces image) */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-56 w-full sm:h-72 md:h-96 lg:h-full">
            
            <video
              className="absolute inset-0 w-full h-full object-cover object-top"
              src="https://res.cloudinary.com/dzag6yjuq/video/upload/v1778318812/billboard1_1_cpb4pe.mp4"
              autoPlay
              muted
              loop
              playsInline
            />

          </div>
        </div>
      </div>
    </div>
  );
}