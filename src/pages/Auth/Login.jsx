import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Ui/Loader";

function Login() {
  const [data, setData] = useState({ phone_number: "", password: "" });
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.dezinfeksiyatashkent.uz/api/auth/signin",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("sign-in failed");
      }
      const responseData = await response.json();
      localStorage.setItem(
        "access_token",
        responseData?.data?.tokens?.accessToken?.token
      );
      localStorage.setItem("userName", responseData?.data?.user?.firstName);
      setLoading(false);
      toast.success("You are logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error(error?.message);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <div className="login_input">
          <CiUser
            style={{
              color: "gray",
              position: "absolute",
              top: "83px",
              left: "40px",
              fontSize: "19px",
            }}
          />
          <input
            type="text"
            name="phoneNumber"
            value={data.phone_number}
            onChange={(e) => setData({ ...data, phone_number: e.target.value })}
            className={styles["input-field"]}
            placeholder={"Phone Number"}
          />
        </div>

        <div className="login_input">
          <RiLockPasswordLine
            style={{
              color: "gray",
              position: "absolute",
              top: "143px",
              left: "40px",
              fontSize: "19px",
            }}
          />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className={styles["input-field"]}
            placeholder="Password"
          />
        </div>
        <button type="submit" className={styles["submit-btn"]}>
          Submit
        </button>
      </form>
    </>
  );
}

export default Login;
