const timeline = [
    {
        name: "Job Analysis & Planning",
        description: "Defining the role and creating a job description.",
        step: "01",
        dateTime: "2021-08",
      },
      {
        name: "Sourcing Candidates",
        description: "Finding potential candidates through internal and external channels.",
        step: "02",
        dateTime: "2021-08",

      },
      {
        name: "Screening & Shortlisting",
        description: "Reviewing applications and conducting initial interviews.",
        step: "03",
        dateTime: "2021-08",
        
      },
      {
        name: "Selection & Onboarding", 
        description: "Making an offer and welcoming the new hire.",
        dateTime: "2021-08",
        step: "04",
      }
  ]
  
  export default function Timeline() {
    return (
      <div className=" py-12 bg-[#f9fafc] sm:py-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 lg:text-center">
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
          Our Process of Recruitment
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
          We conduct extensive search for quality candidates based on our client preferences and requirements for filling up various positions in their companies.
          </p>
        </div>
        <div className="mx-auto max-w-7xl mt-8 px-6 lg:px-8">
            
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.name}>
                <time dateTime={item.dateTime} className="flex items-center text-sm/6 font-semibold text-[#065de8]">
                  <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                    <circle r={2} cx={2} cy={2} fill="currentColor" />
                  </svg>
                  {item.step}
                  <div
                    aria-hidden="true"
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  />
                </time>
                <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">{item.name}</p>
                <p className="mt-1 text-base/7 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  