import React, { useEffect, useState } from 'react'
function AddAppointment() {
    const [doctor, setDoctor] = useState([]);
    const [form, setForm] = useState({
        doctor: "",
        date: "",
        reason: ""
    });

    useEffect(() => 
    {
        const fetchDoctors = async () => {
            const res = await fetch("http://localhost:5000/doctors/getDoctors")
            const data = await res.json()
            setDoctor(data.doctors)
        }
        fetchDoctors()
    }, []);

  return (
      <div className='flex justify-center items-center h-screen'>
          <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
              <h1 className='text-2xl font-bold mb-4'>Add Appointment</h1>
              <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='doctor'>
                      Doctor
                  </label>
                  <select
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      id='doctor'
                      name='doctor'
                      value={form.doctor}
                      onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  >
                      <option value=''>Select a doctor</option>
                      {doctor.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                              {doc.name}
                          </option>
                      ))}
                  </select>
              </div>
              <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='date'>
                      Date
                  </label>
                  <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='date'
                      id='date'
                      name='date'
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
              </div>
              <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='reason'>
                      Reason
                  </label>
                  <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      id='reason'
                      name='reason'
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  />
              </div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
                  Submit
              </button>
          </form>
          
      
    </div>
  )
}

export default AddAppointment
