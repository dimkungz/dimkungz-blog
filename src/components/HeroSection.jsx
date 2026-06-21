import heroPic from '../assets/heropic.jpg'
function HeroSection() {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24 mt-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-12">
          <div className="order-1 flex flex-col gap-4 text-center lg:order-0 lg:items-end lg:text-right">
            <h1 className="pl-2 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Stay Informed,
              <br />
              Stay Inspired
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-stone-500 sm:text-base lg:ml-auto">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
              Inspiration and Information.
            </p>
          </div>
  
          <div className="order-2 flex justify-center lg:order-0">
            <div className="aspect-3/4 w-full max-w-[260px] overflow-hidden rounded-3xl sm:max-w-[300px] lg:max-w-[320px] xl:max-w-[360px]">
              <img
                src={heroPic}
                alt="Author with a cat on his shoulder in an autumn forest"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
  
          <div className="order-3 flex flex-col gap-3 text-center lg:order-0 lg:items-start lg:text-left">
            <span className="text-sm text-stone-400">-Author</span>
            <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Thompson P.</h2>
            <div className="flex max-w-sm flex-col gap-4 text-sm leading-relaxed text-stone-500 sm:text-base lg:max-w-xs">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal
                behavior and care. With a deep love for cats, I enjoy sharing insights
                on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local animal
                shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  export default HeroSection