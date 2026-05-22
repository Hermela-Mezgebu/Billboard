import Echo from "laravel-echo";
import Pusher from "pusher-js";

// ✅ Fix TypeScript
declare global {
  interface Window {
    Pusher: any;
  }
}

// ✅ Attach Pusher globally
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",

  key: "2b1755cf138325a10fb1",
  cluster: "mt1",
  forceTLS: true,

  client: new Pusher("2b1755cf138325a10fb1", {
    cluster: "mt1",
  }),

  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});

export default echo;