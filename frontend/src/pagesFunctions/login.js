import { API_URL } from "@/config/constants";

async function login(username, password) {
  const fetchUrl = API_URL + "user/login";

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    throw error;
  }
}

export default login;
