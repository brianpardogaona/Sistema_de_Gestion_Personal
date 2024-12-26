import { API_URL } from "@/config/constants";

async function login(username, password) {
  const fetchUrl = API_URL + "user/login";

  await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}

export default login;
