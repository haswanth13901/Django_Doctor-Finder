"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDoctorData } from "@/utils/api";
import { FHIRPractitioner } from "@/utils/types";

export default function DoctorProfilePage() {
  const params = useParams();
  const practitionerId = params?.practitioner_id as string;

  const [doctor, setDoctor] = useState<FHIRPractitioner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!practitionerId) return;

      try {
        const data = await getDoctorData(practitionerId);
        setDoctor(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching doctor data:", err.response?.status, err.response?.data);
        setError("Unable to fetch doctor data.");
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [practitionerId]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error || !doctor) return <div className="text-red-500 text-center mt-10">Doctor not found.</div>;

  const phone = doctor.telecom?.find(t => t.system === "phone")?.value ?? "N/A";
  const email = doctor.telecom?.find(t => t.system === "email")?.value ?? "N/A";
  const name = `${doctor.name?.[0]?.given?.[0] ?? ""} ${doctor.name?.[0]?.family ?? ""}`.trim();
  const specialty = doctor.specialty?.[0]?.coding?.[0]?.display ?? "N/A";

  function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    localStorage.removeItem("accessToken");
    window.location.href = "/login"; // update path if needed
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/background_image.jpg')" }}
    >
      {/* Logout Button in Page Top Right */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow-md"
      >
        Logout
      </button>

      <div className="bg-gray-800/90 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-4">
            {name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">Dr. {name}</h1>
          <p className="text-sm text-purple-300 mb-1">{specialty}</p>
          <p className="text-sm text-gray-300 mb-1">📞 {phone}</p>
          <p className="text-sm text-gray-300">✉️ {email}</p>
        </div>
      </div>
    </div>
  );
}
