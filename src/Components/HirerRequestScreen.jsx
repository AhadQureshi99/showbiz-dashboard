import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

// Base64-encoded dummy user image (generic silhouette)
const fallbackImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTdFN0U3Ii8+CjxwYXRoIGQ9Ik01MCAzN0M1NS41MjI5IDM3IDYwIDMyLjUyMjkgNjAgMjdDMjAuNjY2NyAyNyA0MCAyNyA0MCAyN0M0MCAzMi41MjI5IDQ0LjQ3NzEgMzcgNTAgMzdabTMwIDE4YzAgOC44MjcxIC03LjE3MjkgMTYgLTE2IDE2SDMyQzIzLjE3MjkgNzMgMTYgNjUuODIyOSAxNiA1N0MyMCA1NyA0MCA1NyA0MCA1N0M0MCA2Mi41MjI5IDQ0LjQ3NzEgNjcgNTAgNjdDNjAuNDc3MSA2NyA4MCA1NyA4MCA1N1oiIGZpbGw9IiM5QjlCOWIiLz4KPC9zdmc+";

const API_BASE_URL = "https://shobiz.xyz";

const HirerRequestScreen = ({ searchQuery = "" }) => {
  const [hirers, setHirers] = useState([]);
  const [acceptedHirers, setAcceptedHirers] = useState([]);
  const [talents, setTalents] = useState([]);
  const [filteredHirers, setFilteredHirers] = useState([]);
  const [filteredAcceptedHirers, setFilteredAcceptedHirers] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hirerCount, setHirerCount] = useState(0);
  const [talentCount, setTalentCount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(""); // "hirer", "acceptedHirer", or "talent"

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch pending hirers
        const hirerResponse = await axios.get(
          `${API_BASE_URL}/api/hirers/pending-hirers`
        );
        setHirers(hirerResponse.data.hirers || []);
        setFilteredHirers(hirerResponse.data.hirers || []);

        // Fetch accepted hirers
        const acceptedHirerResponse = await axios.get(
          `${API_BASE_URL}/api/hirers/accepted-hirers`
        );
        setAcceptedHirers(acceptedHirerResponse.data.hirers || []);
        setFilteredAcceptedHirers(acceptedHirerResponse.data.hirers || []);

        // Fetch all hirers for count
        const allHirersResponse = await axios.get(
          `${API_BASE_URL}/api/hirers/all-hirers`
        );
        setHirerCount(allHirersResponse.data.hirers?.length || 0);

        // Fetch all talents
        const talentResponse = await axios.get(
          `${API_BASE_URL}/api/talents/public-talents`
        );
        setTalents(talentResponse.data.talents || []);
        setFilteredTalents(talentResponse.data.talents || []);
        setTalentCount(talentResponse.data.talents?.length || 0);

        setError(null);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch data";
        setError(errorMessage);
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    const lowerQuery = (searchQuery || "").toLowerCase().trim();
    setFilteredHirers(
      hirers.filter((hirer) =>
        (hirer.name || "").toLowerCase().includes(lowerQuery)
      )
    );
    setFilteredAcceptedHirers(
      acceptedHirers.filter((hirer) =>
        (hirer.name || "").toLowerCase().includes(lowerQuery)
      )
    );
    setFilteredTalents(
      talents.filter((talent) =>
        (talent.name || "").toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery, hirers, acceptedHirers, talents]);

  // Handle approve or reject action for hirers
  const handleStatusUpdate = async (hirerId, status) => {
    try {
      await axios.post(`${API_BASE_URL}/api/hirers/manage-status/${hirerId}`, {
        status,
      });
      setHirers(hirers.filter((hirer) => hirer._id !== hirerId));
      setFilteredHirers(
        filteredHirers.filter((hirer) => hirer._id !== hirerId)
      );
      setHirerCount((prev) => (status === "approved" ? prev + 1 : prev));
      if (status === "approved") {
        const updatedHirer = hirers.find((hirer) => hirer._id === hirerId);
        if (updatedHirer) {
          const updatedHirerWithStatus = {
            ...updatedHirer,
            status: "approved",
          };
          setAcceptedHirers([...acceptedHirers, updatedHirerWithStatus]);
          setFilteredAcceptedHirers([
            ...filteredAcceptedHirers,
            updatedHirerWithStatus,
          ]);
        }
      }
      setError(null);
      toast.success(`Hirer ${status} successfully`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || `Failed to ${status} hirer`;
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    }
  };

  // Open modal with details
  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
    setModalType("");
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 ">
          Admin Dashboard
        </h1>

        {/* Dashboard Summary */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-purple-700">
              Total Hirers
            </h2>
            <p className="text-3xl font-bold text-gray-800">{hirerCount}</p>
            <p className="text-sm text-gray-600">
              Including pending, approved, and rejected
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-purple-700">
              Total Talents
            </h2>
            <p className="text-3xl font-bold text-gray-800">{talentCount}</p>
            <p className="text-sm text-gray-600">All registered talents</p>
          </div>
        </div>

        {/* Pending Hirer Requests Section */}
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">
          Pending Hirer Requests
        </h2>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && filteredHirers.length === 0 && !error && (
          <p className="text-gray-600">
            {searchQuery
              ? "No pending hirers match your search."
              : "No pending hirer requests found."}
          </p>
        )}

        {!loading && filteredHirers.length > 0 && (
          <div className="bg-white rounded-xl shadow w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[14%]">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[18%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHirers.map((req) => (
                  <tr key={req._id}>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {req.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 break-words">
                      {req.role || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {req.email || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {req.phone || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {req.gender || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium"
                          onClick={() => openModal(req, "hirer")}
                        >
                          View Details
                        </button>
                        <button
                          className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-medium"
                          onClick={() =>
                            handleStatusUpdate(req._id, "approved")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="bg-fuchsia-400 hover:bg-fuchsia-600 text-white px-2 py-1 rounded-lg text-xs font-medium"
                          onClick={() =>
                            handleStatusUpdate(req._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Accepted Hirers Section */}
        <h2 className="text-2xl font-semibold text-purple-800 mb-4 mt-8">
          Accepted Hirers
        </h2>
        {!loading && filteredAcceptedHirers.length === 0 && !error && (
          <p className="text-gray-600">
            {searchQuery
              ? "No accepted hirers match your search."
              : "No accepted hirers found."}
          </p>
        )}

        {!loading && filteredAcceptedHirers.length > 0 && (
          <div className="bg-white rounded-xl shadow w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[16%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAcceptedHirers.map((hirer) => (
                  <tr key={hirer._id}>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {hirer.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 break-words">
                      {hirer.role || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {hirer.email || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {hirer.phone || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {hirer.gender || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {hirer.createdAt
                        ? new Date(hirer.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium"
                        onClick={() => openModal(hirer, "acceptedHirer")}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Talents Section */}
        <h2 className="text-2xl font-semibold text-purple-800 mb-4 mt-8">
          Registered Talents
        </h2>
        {!loading && filteredTalents.length === 0 && !error && (
          <p className="text-gray-600">
            {searchQuery
              ? "No talents match your search."
              : "No talents found."}
          </p>
        )}

        {!loading && filteredTalents.length > 0 && (
          <div className="bg-white rounded-xl shadow w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Skills
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider w-[12%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTalents.map((talent) => (
                  <tr key={talent._id}>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 break-words">
                      {talent.role || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.email || "Not visible"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.phone || "Not visible"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.gender || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.age || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.skills || "None"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 break-words">
                      {talent.createdAt
                        ? new Date(talent.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium"
                        onClick={() => openModal(talent, "talent")}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "500px",
              width: "90%",
              padding: "20px",
              borderRadius: "10px",
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              overflow: "auto",
            },
            overlay: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          {selectedItem && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-purple-800">
                {modalType === "talent" ? "Talent" : "Hirer"} Details
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    modalType === "talent"
                      ? selectedItem.profilePic || fallbackImage
                      : selectedItem.profilePic_url || fallbackImage
                  }
                  alt={selectedItem.name || "User"}
                  className="w-24 h-24 rounded-full object-cover border border-purple-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-purple-700">
                    {selectedItem.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedItem.role || "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Email:</strong> {selectedItem.email || "Not visible"}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedItem.phone || "Not visible"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedItem.gender || "N/A"}
                </p>
                {modalType === "talent" && (
                  <>
                    <p>
                      <strong>Age:</strong> {selectedItem.age || "N/A"}
                    </p>
                    <p>
                      <strong>Skills:</strong> {selectedItem.skills || "None"}
                    </p>
                  </>
                )}
                {(modalType === "hirer" || modalType === "acceptedHirer") && (
                  <p>
                    <strong>Status:</strong> {selectedItem.status || "N/A"}
                  </p>
                )}
                <p>
                  <strong>Registered:</strong>{" "}
                  {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg mt-4"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HirerRequestScreen;
