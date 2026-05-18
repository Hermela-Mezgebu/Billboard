export type Role = "admin" | "reviewer" | "viewer";

export function canApprove(role: Role) {
  return role === "admin" || role === "reviewer";
}

export function canDelete(role: Role) {
  return role === "admin";
}