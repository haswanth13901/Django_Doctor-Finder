"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getAccessToken, logout } from "@/utils/auth";

type Doctor = {
  practitioner_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  city?: string;
  state?: string;
  zip_code?: string;
};

export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();

  const fetchDoctors = async (page = 1) => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      setError("No token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("page_size", "12");
      if (specialization) queryParams.append("specialization", specialization);
      if (city) queryParams.append("city", city);
      if (state) queryParams.append("state", state);
      if (zipCode) queryParams.append("zip_code", zipCode);

      const nameParts = search.trim().split(" ");
      if (nameParts[0]) queryParams.append("first_name", nameParts[0]);
      if (nameParts[1]) queryParams.append("last_name", nameParts[1]);

      queryParams.append("sort", sortOrder);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/doctors/filter/?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTotalCount(res.data.count);
      const result: Doctor[] = res.data.results;

      result.sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      setDoctors(result);
      setTotalPages(Math.ceil(res.data.count / 12));
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors(1);
  }, [search, specialization, city, state, zipCode, sortOrder]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getPageNumbers = (): number[] => {
    const maxPagesToShow = 9;
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: "url('/images/background_image.jpg')" }}
    >
      <div className="flex items-center justify-between mb-6 bg-gray-900/80 p-4 rounded">
        <h1 className="text-3xl font-bold">Doctor List</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Filter Box */}
      <div className="bg-gray-900/80 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>🧭</span> Filter Doctors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Search Zip-Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full"
          >
            <option value="asc">Sort A–Z</option>
            <option value="desc">Sort Z–A</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <p className="mb-4 text-gray-300">
            Showing {doctors.length} doctor{doctors.length !== 1 && "s"} out of{" "}
            {totalCount}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.practitioner_id}
                onClick={() => router.push(`/doctor/${doc.practitioner_id}`)}
                className="bg-gray-900/80 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-lg font-bold">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Dr. {doc.first_name} {doc.last_name}
                    </h3>
                    <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full">
                      {doc.specialization}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-300 flex items-center gap-1">
                  📍 {doc.city}, {doc.state} {doc.zip_code}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => fetchDoctors(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            >
              ◀ Previous
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => fetchDoctors(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-white text-gray-900 font-bold"
                    : "bg-gray-700 text-white border-gray-600"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => fetchDoctors(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
