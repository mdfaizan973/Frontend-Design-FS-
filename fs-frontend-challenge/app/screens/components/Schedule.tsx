import React from "react";

interface ScheduleProps {
  dark: boolean;
}

export default function Schedule({ dark }: ScheduleProps) {
  return (
    <div className={`border rounded-2xl shadow-sm p-8 sm:p-10 min-h-[500px] ${dark ? "bg-[#161b21] border-white/5" : "bg-white border-gray-200"}`}>

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
            Schedule
          </h1>
          <p className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Manage upcoming and recurring scan schedules.
          </p>
        </div>

        <button className="px-5 py-2.5 cursor-pointer rounded-lg text-sm font-medium bg-[#0CC8A8] text-white hover:opacity-90 transition">
          + New Schedule
        </button>
      </div>

      <div className="flex items-center justify-center h-[320px]">
        <div className="text-center">
          <div className={`mx-auto mb-5 h-16 w-16 rounded-full flex items-center justify-center text-xl ${dark ? "bg-white/5" : "bg-gray-100"}`}>
         📅 </div>

          <h3 className={`text-lg font-medium ${dark ? "text-white" : "text-gray-900"}`}>
            No schedules yet
          </h3>

          <p className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Create a schedule to automate your security scans.
          </p>

          <button className="mt-6 px-6 py-2.5 cursor-pointer rounded-lg text-sm font-medium bg-[#0CC8A8] text-white hover:opacity-90 transition">
            Create Schedule
          </button>
        </div>
      </div>

    </div>
  );
}