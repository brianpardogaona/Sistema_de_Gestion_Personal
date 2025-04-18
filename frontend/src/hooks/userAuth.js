import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/user/validate-token",
          {
            credentials: "include",
          }
        );

        if (res.status !== 200) {
          navigate("/", { replace: true });
        }
      } catch (err) {
        navigate("/", { replace: true });
      }
    };

    validate();
  }, []);
}
