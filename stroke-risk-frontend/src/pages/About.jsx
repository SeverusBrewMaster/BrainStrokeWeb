import React from 'react';
import Header from '../components/Header';
import EmergencyButton from '../components/EmergencyButton';
const About = () => {
  return (
    <>
    {/* Tailwind CSS CDN */}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              About Brain Line
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Empowering communities through education, awareness, and innovative healthcare solutions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Project Overview */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full">
                <span className="text-purple-800 font-semibold">Our Vision</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                About the <span className="text-purple-600">Brain Line Project</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Brain-line is a dedicated initiative by Purva Medical Trust, focused on creating widespread awareness about brainstroke prevention and recovery. Founded with a vision to empower individuals through education and resources, we are committed to reducing the impact of brainstroke by fostering early detection, preventive measures, and comprehensive support for survivors.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join us in our mission to build a healthier, stroke-free society. Together, we can make a difference.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/AboutBrainLine.jpg" 
                  alt="Brain Line Project"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-2">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/OurMission.jpeg" 
                  alt="Our Mission"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20"></div>
            </div>
            <div className="space-y-6 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full">
                <span className="text-indigo-800 font-semibold">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Preventing Brainstrokes Through <span className="text-indigo-600">Education</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Brainline, our mission is to prevent brainstrokes through education, awareness, and community support. We are dedicated to providing accessible information and resources that empower individuals to recognize the risks and signs of brainstroke, take proactive health measures, and support survivors on their journey to recovery.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By fostering a community built on knowledge, compassion, and resilience, we aim to reduce the incidence of brainstrokes and improve the quality of life for those affected.
              </p>
            </div>
          </div>
        </section>

        {/* Dr. Ashok Hande Section */}
        <section className="mb-24">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                  <span className="text-green-800 font-semibold">Leadership</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Meet <span className="text-green-600">Dr. Ashok Hande</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Dr. Ashok Hande is a distinguished figure in the field of neurological surgery, renowned for his expertise and dedication to enhancing the lives of his patients. With over three decades of experience, he stands as a beacon of excellence in neurosurgical care.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Currently serving as the Director of the Department of Neurological Surgery at Fortis Hospital, Navi Mumbai, and as a Visiting Consultant at the esteemed Ruby Hall Clinic and Research Centre in Pune, Dr. Hande brings forth a wealth of knowledge and skill to his practice.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Brain Stroke Surgery</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Aneurysm Treatment</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">AVM Surgery</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Neuro-rehabilitation</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/Dr.AshokHande1.jpg" 
                    alt="Dr. Ashok Hande"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Board of Directors */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Board of Directors</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Dr. Ashok Hande",
                role: "President",
                image: "/images/Dr.AshokHande2.jpg",
                description: "Dr. Ashok Hande, a renowned neurosurgeon with 30+ years of experience, is the Director of Neurological Surgery at Fortis Hospital, Navi Mumbai, and a Visiting Consultant at Ruby Hall Clinic, Pune."
              },
              {
                name: "Mrs. Prema Hande",
                role: "Treasurer",
                image: "/images/Mrs.PremaHande.jpg",
                description: "Prema Hande, a dedicated nurse with 20 years at BYL Nair Hospital, Mumbai, has made a lasting impact on community health. As Treasurer of Purva Medical Trust, she supports its mission."
              }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="p-8 text-center">
                    <div className="relative inline-block mb-6">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 group-hover:from-purple-500/30 group-hover:to-indigo-500/30 transition-all duration-300"></div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Board */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Executive Board</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Amit Dave",
                image: "/images/AmitDave.jpg",
                description: "Amit, a chemistry graduate and entrepreneur with 30+ years in sales, marketing, and business development, excels in chemical trading, hospitality, and startups."
              },
              {
                name: "Mr. Diwakar Kallianpur",
                image: "/images/Mr.Kallipur.jpg",
                description: "Diwakar, with 36+ years in Finance and Marketing, spent 34 years at UTI Mutual Fund, rising to Senior EVP & Zonal Head - South."
              },
              {
                name: "Milind V Sawai",
                image: "/images/MilindVSewai.jpg",
                description: "Milind, a chemical engineer and MBA in marketing, has 20+ years of experience with Fortune 500 companies. Now an entrepreneur in specialty chemicals."
              },
              {
                name: "Dr. Alka Patnaik",
                image: "/images/Dr.AlkaPatil.jpg",
                description: "A medical professional and social entrepreneur with 25+ years of experience across various sectors. A Guinness World Records organizer and participant."
              }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  <div className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto shadow-md"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advisory Board */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advisory Board</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Dr. Anil Karapurkar",
                image: "/images/Dr.AnilKarapurkar.jpg",
                description: "Dr. Karapurkar, a renowned neurosurgeon and pioneer of interventional neuro-radiology in India, has led AAFITN and the Cerebrovascular Society of India."
              },
              {
                name: "Dr. Santosh Prabhu",
                image: "/images/Dr.SantoshPrabhu.jpg",
                description: "Dr. Prabhu, a neurosurgeon with 36 years of experience and 30 years in teaching, holds an MBBS, MS, and M.Ch. in Neurosurgery."
              },
              {
                name: "Dr. Ashok Bhanage",
                image: "/images/Dr.AshokBhanage.jpg",
                description: "Dr. Bhanage, Director and Head of Neurosurgery & Radiosurgery at Ruby Hall Clinic, Pune, has been instrumental in advancing neurosurgical care."
              },
              {
                name: "Mr. Shahzad Barodawala",
                image: "/images/Mr.Shazad.jpg",
                description: "Shahzad, an entrepreneur and independent web & graphic designer, actively supports sustainability and philanthropy through NGOs."
              },
              {
                name: "Ms. Mazida",
                image: "/images/Ms.Mazida.jpg",
                description: "Ms. Mazida, an Assistant Vice President in banking from Madhya Pradesh, manages ultra HNI clients' wealth."
              },
              {
                name: "Rashmi Kaul",
                image: "/images/Rashmi Kaul.png",
                description: "Rashmi Kaul, a healthcare evangelist with 30 years of experience, has held C-suite roles at HealthCare Global Enterprises and Fortis Healthcare."
              }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  <div className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto shadow-md"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">Join Our Mission</h3>
              <p className="text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
                We need your help to raise awareness and develop a network for this deadly but preventable disease. If you or someone you know has been affected by brain stroke, we invite you to share your experience to help others.
              </p>
              <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                We are forming a WhatsApp group of like-minded people to discuss factors that led to brain hemorrhage in patients and whether timely treatment was beneficial. This information will serve as a guide to those with risk factors (SHAADOWSS) and as a major prevention tool.
              </p>
              <a 
                href="#contact" 
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Contact Us to Join
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Brain Line Project</h3>
            <p className="text-gray-300 mb-2">A brainchild of Purva Medical Trust, founded by Dr. Ashok Hande</p>
            <p className="text-gray-300 mb-8">In collaboration with the Rotary Clubs of Navi Mumbai</p>
            <div className="flex justify-center space-x-6 mb-8">
              {['facebook-f', 'twitter', 'whatsapp', 'instagram'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-purple-600 transition-all duration-300"
                >
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">&copy; 2025 Brain Line Project. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <EmergencyButton />
  </>
  );
};

export default About;