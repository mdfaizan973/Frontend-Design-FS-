import React from "react";

interface ProjectsProps {
  dark: boolean;
}

export default function NewScan({ dark }: ProjectsProps) {
  return (
    <div className={`border rounded-2xl shadow-sm p-8 sm:p-10 min-h-[550px] ${dark ? "bg-[#161b21] border-white/5" : "bg-white border-gray-200"}`}>
      

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="flex flex-col">
          <label className={`mb-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Scan Name
          </label>
          <input type="text" placeholder="Enter scan name"
            className={`rounded-lg px-4 py-3 text-sm outline-none border transition ${dark ? "bg-[#0f141a] border-white/10 text-white placeholder-gray-500 focus:border-[#0CC8A8]" : "bg-gray-50 border-gray-300 text-gray-900 focus:border-[#0CC8A8]"}`} />
        </div>

        <div className="flex flex-col">
          <label className={`mb-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Target
          </label>
          <input type="text" placeholder="192.168.1.0/24 or app.example.com"
            className={`rounded-lg px-4 py-3 text-sm outline-none border transition ${dark ? "bg-[#0f141a] border-white/10 text-white placeholder-gray-500 focus:border-[#0CC8A8]" : "bg-gray-50 border-gray-300 text-gray-900 focus:border-[#0CC8A8]"}`} />
        </div>

        <div className="flex flex-col">
          <label className={`mb-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Scan Type
          </label>
          <select className={`rounded-lg px-4 py-3 text-sm outline-none border transition ${dark ? "bg-[#0f141a] border-white/10 text-white focus:border-[#0CC8A8]" : "bg-gray-50 border-gray-300 text-gray-900 focus:border-[#0CC8A8]"}`}>
            <option>Greybox</option>
            <option>Blackbox</option>
            <option>Whitebox</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={`mb-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Schedule
          </label>
          <select className={`rounded-lg px-4 py-3 text-sm outline-none border transition ${dark ? "bg-[#0f141a] border-white/10 text-white focus:border-[#0CC8A8]" : "bg-gray-50 border-gray-300 text-gray-900 focus:border-[#0CC8A8]"}`}>
            <option>Run Now</option>
            <option>Schedule for Later</option>
          </select>
        </div>

      </div>

      {/* Button */}
      <div className="mt-12 flex justify-end">
        <button className="px-8 py-3 rounded-lg text-sm font-medium bg-[#0CC8A8] text-white hover:opacity-90 transition">
          Start Scan
        </button>
      </div>

    </div>
  );
}