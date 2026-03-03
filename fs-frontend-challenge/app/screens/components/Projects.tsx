import React from "react";

interface ProjectsProps {
  dark: boolean;
}

export default function Projects({ dark }: ProjectsProps) {
  return (
    <div className={`border rounded-2xl shadow-sm p-8 sm:p-10 min-h-[500px] ${dark ? "bg-[#161b21] border-white/5" : "bg-white border-gray-200"}`}>

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
            Projects
          </h1>
          <p className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Organize and manage your projects.
          </p>
        </div>

        <button className="px-5 py-2.5 cursor-pointer rounded-lg text-sm font-medium bg-[#0CC8A8] text-white hover:opacity-90 transition">
          + New Project
        </button>
      </div>

      <div className="flex items-center justify-center h-[320px]">
        <div className="text-center">
          <div className={`mx-auto mb-5 h-16 w-16 rounded-full flex items-center justify-center text-xl ${dark ? "bg-white/5" : "bg-gray-100"}`}>
            📁
          </div>

          <h3 className={`text-lg font-medium ${dark ? "text-white" : "text-gray-900"}`}>
            No projects yet
          </h3>

          <p className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Create your first project to start organizing scans.
          </p>

          <button className="mt-6 cursor-pointer px-6 py-2.5 rounded-lg text-sm font-medium bg-[#0CC8A8] text-white hover:opacity-90 transition">
            Create Project
          </button>
        </div>
      </div>

    </div>
  );
}