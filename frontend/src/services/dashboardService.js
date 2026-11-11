import { api } from "./api";

// GET /api/dashboard/profissional
export async function obterDashboardProfissional() {
  return api.get("/dashboard/profissional");
}

// GET /api/dashboard/admin
export async function obterDashboardAdmin() {
  return api.get("/dashboard/admin");
}