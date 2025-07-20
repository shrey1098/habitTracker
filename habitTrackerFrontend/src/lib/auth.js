import { verifyUser } from "./api.js";
import {user} from "../../src/stores/user.js";

export function isLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
}


export async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    user.set(null);
    return;
  }
  
  const res = await verifyUser(token);
  if (res && res.success) {
    user.set(res.user);
  } else{
    localStorage.removeItem('token');
    user.set(null);
  }
}
