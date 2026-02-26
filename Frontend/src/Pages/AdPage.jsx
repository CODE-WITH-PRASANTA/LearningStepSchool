import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/drk.jpg";

export default function AdPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-[80vh] w-[40vw] fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      
      {/* Close Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg z-10"
      >
        ✕
      </button>

      {/* Sized Image */}
      <img
        src={img}
        alt="Advertisement"
        className="h-[80vh] w-[40vw] object-contain"
      />
    </div>
  );
}   