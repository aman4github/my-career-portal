import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    // FETCH USER DATA
    useEffect(() => {

        const adminData = JSON.parse(
            localStorage.getItem("admin")
        );

        if (!adminData) {

            navigate("/");

            return;
        }

        const fetchUser = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:8090/management/user/getuser/${id}`
                );

                const user = response.data;

                setFullname(user.fullname);
                setEmail(user.email);
                setPhone(user.phone);
                setPassword(user.password);

            } catch (error) {

                console.log(error);
            }
        };

        fetchUser();

    }, [id]);

    // UPDATE USER
    const handleUpdate = async () => {

        const result = await Swal.fire({
            title: "Update User?",
            text: "User details will be updated.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            confirmButtonText: "Update"
        });

        if (result.isConfirmed) {

            try {

                await axios.put(
                    `http://localhost:8090/management/user/updateuser/${id}`,
                    {
                        fullname,
                        email,
                        phone,
                        password
                    }
                );

                await Swal.fire({
                    title: "Success!",
                    text: "User updated successfully.",
                    icon: "success"
                });

                navigate("/edit-user");

            } catch (error) {

                console.log(error);

                Swal.fire({
                    title: "Error!",
                    text: "Failed to update user.",
                    icon: "error"
                });
            }
        }
    };

    return (
        <div className="min-h-screen w-[80%] bg-gray-100 flex rounded-[2.5rem] justify-center items-center p-6">

            <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl p-10">

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">
                        Update User
                    </h1>

                    <button
                        onClick={() => navigate("/edit-user")}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600"
                    >
                        Go Back
                    </button>

                </div>

                <div className="space-y-5">

                    {/* FULL NAME */}
                    <div>

                        <label className="block text-lg font-semibold mb-2">
                            New Name
                        </label>

                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Enter Full Name"
                            className="w-full p-4 rounded-2xl border outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* EMAIL */}
                    <div>

                        <label className="block text-lg font-semibold mb-2">
                            New Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            className="w-full p-4 rounded-2xl border outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* PHONE */}
                    <div>

                        <label className="block text-lg font-semibold mb-2">
                            New Phone Number
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Phone Number"
                            className="w-full p-4 rounded-2xl border outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* ROLE */}
                    <div>

                        <label className="block text-lg font-semibold mb-2">
                            New Password
                        </label>

                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter New Password"
                            className="w-full p-4 rounded-2xl border outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* UPDATE BUTTON */}
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all"
                    >
                        Update User
                    </button>

                </div>

            </div>

        </div>
    );
};

export default UpdateUser;