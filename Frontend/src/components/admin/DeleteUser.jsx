import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const DeleteUser = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This user will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete"
        });

        if (result.isConfirmed) {

            try {

                await axios.delete(
                    `http://localhost:8090/management/user/deleteuser/${id}`
                );

                // REMOVE USER FROM UI
                setUsers(
                    users.filter((user) => user.id !== id)
                );

                Swal.fire({
                    title: "Deleted!",
                    text: "User deleted successfully.",
                    icon: "success"
                });

            } catch (error) {

                console.log(error);

                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete user.",
                    icon: "error"
                });
            }
        }
    };

    

    // FETCH USERS FROM BACKEND
    useEffect(() => {

        const adminData = JSON.parse(
            localStorage.getItem("admin")
        );

        if (!adminData) {

            navigate("/");

            return;
        }

        const fetchUsers = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:8090/management/user/getallusers"
                );

                console.log(response.data);

                setUsers(response.data);

            } catch (error) {

                console.log(error);

            }
        };

        fetchUsers();

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex rounded-[2.5rem] justify-center items-center p-6">

            {/* MAIN CARD */}
            <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl p-10">

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">
                        Delete User
                    </h1>

                    <button
                        onClick={() => navigate("/admin-panel")}
                        className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all cursor-pointer"
                    >
                        Go Back
                    </button>

                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="bg-gray-100 text-left">

                                <th className="p-4 rounded-l-2xl">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Password</th>
                                <th className="p-4 rounded-r-2xl">Action</th>

                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.fullname}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.phone}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">******</td>

                                    {/* EDIT BUTTON */}
                                    <td className="p-4">

                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </div>
    );
};

export default DeleteUser;