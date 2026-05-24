import Echo from "laravel-echo";
import Pusher from "pusher-js";

// 👇 FIX: use "any"
let echo: any = null;

if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;

  echo = new Echo({
    broadcaster: "pusher",
    key: "2b1755cf138325a10fb1",
    cluster: "mt1",
    forceTLS: true,

    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",

    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });
}

export default echo;