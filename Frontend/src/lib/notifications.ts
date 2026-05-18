export function notify(msg: string, type: "success" | "error" = "success") {
  alert(`${type.toUpperCase()}: ${msg}`);
}