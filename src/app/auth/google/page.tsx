"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FakeGoogleLogin() {
  const router = useRouter();
  const [role, setRole] = useState("client");

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "client");
  }, []);

  const handleAccountSelect = (name: string, email: string) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("isLoggedIn", "true");
    
    // Simulate network delay
    setTimeout(() => {
      const isPro = role === "pro" || localStorage.getItem("userRole") === "pro" || localStorage.getItem("isProIntent") === "true";
      if (isPro) {
        localStorage.setItem("userRole", "pro");
        window.location.href = "/tutor/register";
      } else {
        localStorage.setItem("userRole", "client");
        window.location.href = "/home-cliente";
      }
    }, 800);
  };

  const accounts = [
    { name: "Linda Sofia Santos", email: "santoslindasofia9@gmail.com", initial: "L", color: "bg-pink-100 text-pink-700" },
    { name: "Natalia G", email: "nataliagaleanopelaez@gmail.com", initial: "N", color: "bg-teal-500 text-white" },
    { name: "Daniel Diaz", email: "sanchez.aurorac@gmail.com", initial: "D", color: "bg-gray-500 text-white" },
    { name: "fresasofia", email: "fresasofia96@gmail.com", initial: "f", color: "bg-blue-500 text-white" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center pt-20 font-sans">
      <div className="bg-white rounded-3xl shadow-md w-full max-w-[450px] p-10 overflow-hidden border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" className="mb-4">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          <h1 className="text-2xl font-normal text-[#202124] mb-2">Selecciona una cuenta</h1>
          <p className="text-[16px] text-[#202124] mt-1 text-center">
            Ir a <span className="font-medium text-[#1a73e8]">TrustMarket</span>
          </p>
        </div>

        <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
          {accounts.map((acc, idx) => (
            <button
              key={idx}
              onClick={() => handleAccountSelect(acc.name, acc.email)}
              className="flex items-center gap-4 px-6 py-3 w-full hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 text-left"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${acc.color}`}>
                {acc.initial}
              </div>
              <div className="flex flex-col flex-grow">
                <span className="text-[14px] font-medium text-[#3c4043] leading-tight">{acc.name}</span>
                <span className="text-[12px] text-[#5f6368]">{acc.email}</span>
              </div>
            </button>
          ))}
          <button className="flex items-center gap-4 px-6 py-4 w-full hover:bg-gray-50 transition-colors text-left">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm text-[#5f6368]">
              <svg focusable="false" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="#5f6368"></path></svg>
            </div>
            <span className="text-[14px] font-medium text-[#3c4043]">Usar otra cuenta</span>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-between text-[12px] text-[#5f6368]">
          <select className="bg-transparent border-none outline-none appearance-none cursor-pointer">
            <option>Español (Latinoamérica)</option>
          </select>
          <div className="flex gap-4">
            <a href="#" className="hover:bg-gray-100 p-1 rounded">Ayuda</a>
            <a href="#" className="hover:bg-gray-100 p-1 rounded">Privacidad</a>
            <a href="#" className="hover:bg-gray-100 p-1 rounded">Términos</a>
          </div>
        </div>
      </div>
    </div>
  );
}
