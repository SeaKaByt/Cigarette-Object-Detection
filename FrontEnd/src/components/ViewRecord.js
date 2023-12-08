import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAngleUp } from 'react-icons/fa';
import './ViewRecord.css';

const ViewRecord = () => {
    const [records, setRecords] = useState([]);
    const [showTopBtn, setShowTopBtn] = useState(false);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleDelete = async (recordId) => {
        try {
            const response = await fetch(`/deleteRecord/${recordId}`, { method: 'DELETE' });
            const data = await response.json();
            console.log(data);
            console.log(response);

            fetchRecords();
            toast.success('Record deleted successfully.');
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (recordId) => {
        try {
            const newDescription = prompt('Enter new description'); // 提示用户输入新的描述
            const response = await fetch(`/editRecord/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newDescription }),
            });
            console.log(response);

            fetchRecords();
            toast.success('Record edited successfully.');
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            const response = await fetch('/deleteAll', { method: 'DELETE' });
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                fetchRecords();
                toast.success('All records deleted successfully.');
            } else {
                console.log('Delete all records failed.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await fetch('/getRecord');
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRecords();
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);

    return (
        <section style={{ justifyContent: 'center' }}>
            <div >
                <div class="headerContainer">
                    <ToastContainer />
                    <h1>Records</h1>
                    <button onClick={() => handleDeleteAll()}>Delete All Record</button>
                </div>
                <div class="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Description</th>
                                <th>DateTime</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record._id}>
                                    <td>
                                        <img
                                            src={record.Image}
                                            alt="Record Image"
                                            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td>{record.Description}</td>
                                    <td>{new Date(record.DateTime).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(record._id)}>Edit</button>
                                        <button onClick={() => handleDelete(record._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="top-to-btm">
                {" "}
                {showTopBtn && (
                    <FaAngleUp
                        className="icon-position icon-style"
                        onClick={goToTop}
                    />
                )}{" "}
            </div>
        </section >
    );
};

export default ViewRecord;
