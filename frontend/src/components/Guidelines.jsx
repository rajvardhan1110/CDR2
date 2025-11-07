import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Guidelines() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [caretaker, setCaretaker] = useState({ name: "", gender: "", age: "", mobile: "", email: "", relation: "" });

  if (!token) return navigate("/signin");

  const handleChange = (e) => setCaretaker({ ...caretaker, [e.target.name]: e.target.value });

  const handleStart = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Basic client-side validation for required fields
    if (!caretaker.email || !caretaker.relation) {
      alert('Caretaker email and relation are required');
      setSubmitting(false);
      return;
    }

    try {
      // coerce age to number
      const payload = { caretaker: { ...caretaker, age: caretaker.age ? Number(caretaker.age) : undefined } };
      const res = await api.post("/test/start", payload);
      const id = res.data.testId || res.data.test?._id;
      navigate(`/test/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Assessment Guidelines</h2>
              <p className="text-sm text-gray-600 mt-1">Read before starting the Clinical Dementia Rating (CDR) assessment.</p>
            </div>
            <div className="text-right text-sm text-gray-500">Estimated time: <span className="font-medium text-gray-700">30–60 min</span></div>
          </div>

          <div className="text-gray-700 space-y-3 mb-6">
            <ul className="list-disc list-inside space-y-2">
              <li>Ensure the patient and caretaker are comfortable and seated in a quiet environment.</li>
              <li>The caretaker should be someone who knows the patient well and can answer questions regarding daily functioning.</li>
              <li>Base answers on the patient's typical functioning (not during acute illness or stress).</li>
              <li>The assessor should record the caretaker details to maintain context for this evaluation.</li>
            </ul>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <h3 className="text-lg font-semibold">Caretaker details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="name" value={caretaker.name} onChange={handleChange} placeholder="Caretaker Name" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200" />
              <select name="gender" value={caretaker.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200">
                <option value="">Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <input name="age" type="number" value={caretaker.age} onChange={handleChange} placeholder="Age" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200" />
              <input name="mobile" value={caretaker.mobile} onChange={handleChange} placeholder="Mobile number" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200" />
              <input name="email" type="email" value={caretaker.email} onChange={handleChange} placeholder="Email (required)" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 sm:col-span-2" />
              <input name="relation" value={caretaker.relation} onChange={handleChange} placeholder="Relation to patient (e.g. spouse, son)" required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-200 sm:col-span-2" />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button type="submit" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg" disabled={submitting}>
                {submitting ? 'Starting...' : 'I have read the guidelines — Start Assessment'}
              </Button>
              <Button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
