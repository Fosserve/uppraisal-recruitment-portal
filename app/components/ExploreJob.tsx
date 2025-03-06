import {
    BriefcaseIcon ,
    EnvelopeOpenIcon,
    BuildingOfficeIcon ,
    PhoneArrowDownLeftIcon,
    SignalIcon ,
    UsersIcon ,
  } from '@heroicons/react/24/outline'
  
  const features = [
    {
      name: 'Marketing',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: EnvelopeOpenIcon ,
    },
    {
      name: 'Customer Service',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: PhoneArrowDownLeftIcon,
    },
    {
      name: 'Human Resource',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: BriefcaseIcon ,
    },
    {
      name: 'Project Management',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: UsersIcon ,
    },
    {
      name: 'Business Developmemet',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: BuildingOfficeIcon ,
    },
    {
      name: 'Sales & Communication',
      description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: SignalIcon ,
    },
  ]
  
  export default function Explore() {
    return (
      <div className="relative bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <h2 className="text-lg font-semibold text-[#0d78ff]">JOBS</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Explore By Category
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc, ullamcorper
            malesuada. Eleifend condimentum id viverra nulla.
          </p>
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-xl bg-[#0d78ff] p-3 shadow-lg">
                          <feature.icon aria-hidden="true" className="size-8 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg/8 font-semibold tracking-tight text-gray-900">{feature.name}</h3>
                      <p className="mt-5 text-base/7 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  