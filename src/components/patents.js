"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "./loader";

const AddPatentForm = () => {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState({});
  const [selectedResume, setSelectedResume] = useState(null);

  const [resumes, setResumes] = useState([
  ]);
  const [loading, setLoading] = useState(true);

  const [showMore, setShowMore] = useState(false);
  const maxVisibleResumes = 2;
  const [formData, setFormData] = useState({
    title: "",
    fieldOfInvention: "",
    detailedDescription: "",
    inventor: {
      name: "",
      department: ""
    },
    committeeMembers: [],
    email: "",
    depEmail: "",
    status: "pending approval",
    pdf: pdfFile,
    patentType: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userdata = JSON.parse(localStorage.getItem('userdata'));
      if (userdata) {
        setFormData(prevFormData => ({
          ...prevFormData,
          email: userdata.contactInformation.instituteWebmailAddress
        }));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name in prevData.inventor) {
        return {
          ...prevData,
          inventor: {
            ...prevData.inventor,
            [name]: value,
          },
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };



  const handleCheckboxChange = (e, resume) => {
    const { checked } = e.target;
    setSelectedResume(resume);

    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        pdf: resume,
      }));

    } else {
      setFormData((prevData) => ({
        ...prevData,
        pdf: null,
      }));
    }
  };


  const handleCommitteeMemberChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMembers = [...formData.committeeMembers];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      committeeMembers: updatedMembers,
    }));
  };



  const handleDept = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      depEmail: e.target.value,
    }));
  };


  const addCommitteeMember = () => {
    setFormData((prevData) => ({
      ...prevData,
      committeeMembers: [
        ...prevData.committeeMembers,
        { name: "", email: "", department: "" },
      ],
    }));
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log("File uploaded:", file);



    try {

      // Update resumes state to include the uploaded patent
      setResumes((prevResumes) => [
        ...prevResumes,
        e.target.files[0]
      ]);
    } catch (error) {
      console.error("Error adding patent:", error);
    }
  };
  const removeCommitteeMember = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      committeeMembers: prevData.committeeMembers.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      setLoading(true)
      const response = await axios.post("https://ircpc-backend.onrender.com/api/profiles/addpatents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false)

      console.log("Patent added successfully");
      router.push("/");
      console.log("Patent added successfully:", response.data);
    } catch (error) {
      console.error("Error adding patent:", error);
    } finally {
      // Reset loading after three seconds

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 screen">
      {loading ? (<div className="flex items-start w-full gap-6 px-8 py-7 item md:flex-row">
        <div className="flex flex-col w-7/12 p-6 bg-white rounded-lg shadow-lg md:w-1/2">
          <h2 className="mb-4 text-2xl font-semibold text-center">Add Patent</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mt-2 mb-2 text-lg">Patent Type:</label>
              <select
                name="patentType"
                value={formData.patentType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Patent type</option>
                <option value="Provisional Patent">Provisional Patent</option>
                <option value="Full Patent">Full Patent</option>
                <option value="Trademark">Trademark</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full px-2 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg">Field of Invention:</label>
              <input
                type="text"
                name="fieldOfInvention"
                value={formData.fieldOfInvention}
                onChange={handleInputChange}
                placeholder="Field of Invention"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg">Detailed Description:</label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block mt-2 mb-2 text-lg">Department:</label>
              <select
                name="department"
                onChange={(e) => handleDept(e)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Mechanical Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Chemical Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Civil Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Electrical Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Metallurgy Department</option>
                <option value="zaib.adii@sric.iitr.ac.in">Biotechnology Department</option>
                {/* <option value="Electrical Department">Electrical Department</option>
              <option value="Computer Science Department">Computer Science Department</option> */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg">Inventor Name:</label>
              <input
                type="text"
                name="name"
                value={formData.inventor.name}
                onChange={handleInputChange}
                placeholder="Name of inventor"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mt-2 mb-2 text-lg">Inventor Department:</label>
              <select
                name="department"
                value={formData.inventor.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Department</option>
                <option value="Mechanical Department">Mechanical Department</option>
                <option value="Chemical Department">Chemical Department</option>
                <option value="Civil Department">Civil Department</option>
              </select>
            </div>
            {formData.committeeMembers.map((member, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2 text-lg">Committee Member Name:</label>
                <input
                  type="text"
                  name="name"
                  value={member.name}
                  onChange={(e) => handleCommitteeMemberChange(e, index)}
                  placeholder="Name"
                  className="w-full p-2 border rounded-md"
                />
                <label className="block mt-2 mb-2 text-lg">Committee Member Email:</label>
                <input
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleCommitteeMemberChange(e, index)}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md"
                />
                <label className="block mt-2 mb-2 text-lg">Committee Member Department:</label>
                <select
                  name="department"
                  onChange={(e) => handleCommitteeMemberChange(e, index)}
                  className="w-full p-2 border rounded-md"
                >
                  <option >Select Department</option>
                  <option >Mechanical Department</option>
                  <option >Chemical Department</option>
                  <option >Civil Department</option>
                  {/* <option value="Electrical Department">Electrical Department</option>
              <option value="Computer Science Department">Computer Science Department</option> */}
                </select>
                <button
                  type="button"
                  onClick={() => removeCommitteeMember(index)}
                  className="px-3 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCommitteeMember}
              className="px-3 py-2 mb-4 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Add Committee Member
            </button>


            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>


        <div className="flex flex-col w-5/12 p-6 bg-white rounded-lg shadow-lg md:w-1/2">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Patent Upload</h2>
          <p className="mb-6 text-lg text-gray-600">
            Tick the one patent you want to upload <span className="text-red-500">*</span>
          </p>
          <div className="w-full space-y-4 overflow-hidden">
            {resumes.slice(0, showMore ? resumes.length : maxVisibleResumes).map((resume, index) => (
              <div key={index} className="flex items-center p-4 mb-2 transition duration-300 ease-in-out border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
                <div className="flex-shrink-0">
                  <a href={URL.createObjectURL(resume)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m6 0H9m6 0a9 9 0 110-18 9 9 0 010 18z"></path>
                    </svg>
                  </a>
                </div>
                <div className="flex-1 ml-6">
                  <p className="text-lg font-medium text-gray-700">{resume.name}</p>
                </div>
                <div className="ml-6">
                  <input
                    type="checkbox"
                    checked={selectedResume === resume}
                    name="selectedResume"

                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onChange={(e) => handleCheckboxChange(e, resume)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 space-x-4">
            <button
              id="upload-button"
              className="px-4 py-3 text-base text-white transition duration-300 ease-in-out bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => document.getElementById("file-input").click()}
            >
              Upload Patent
            </button>
            {resumes.length > maxVisibleResumes && (
              <button
                id="show-more-button"
                className="text-lg text-blue-500 hover:underline"
                onClick={handleShowMore}
              >
                {showMore
                  ? "Show less"
                  : `Show ${resumes.length - maxVisibleResumes} more resume${resumes.length - maxVisibleResumes > 1 ? "s" : ""}`}
              </button>
            )}
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept=".pdf, .doc, .docx"
              onChange={handleUpload}
            />
          </div>
          <p className="mt-6 text-base text-gray-500">
            Submitting this application would not change your profile.
          </p>
          <p className="mt-6 text-base text-gray-400">
            Application powered by IITR |{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Help Center
            </a>
          </p>
          <hr className="my-6" />
          <div className="">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">IPO Forms</h1>
            <div className="flex flex-wrap">
              <a href="pdf/form-1.pdf" target="_blank"
                className="inline-block w-24 p-2 mb-4 mr-4 text-base font-semibold text-center text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-600">Form 1</a>
              <a href="pdf/form-2.pdf" target="_blank"
                className="inline-block w-24 p-2 mb-4 mr-4 text-base font-semibold text-center text-blue-500 transition duration-300 ease-in-out bg-white border-2 border-blue-500 rounded-lg hover:bg-gray-100">Form 2</a>
              <a href="pdf/form-3.pdf" target="_blank"
                className="inline-block w-24 p-2 mb-4 mr-4 text-base font-semibold text-center text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-600">Form 3</a>
              <a href="pdf/form-5.pdf" target="_blank"
                className="inline-block w-24 p-2 mb-4 mr-4 text-base font-semibold text-center text-blue-500 transition duration-300 ease-in-out bg-white border-2 border-blue-500 rounded-lg hover:bg-gray-100">Form 5</a>
              <a href="pdf/Form28.pdf" target="_blank"
                className="inline-block w-24 p-2 mb-4 text-base font-semibold text-center text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-600">Form 28</a>
            </div>
          </div>
        </div>
      </div>) : (
        <Loader />
      )}




    </div>
  );
};

export default AddPatentForm;
