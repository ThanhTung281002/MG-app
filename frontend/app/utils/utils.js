console.log("utils/utils.js loaded"); 

import { fakeUsers } from "../services/fakeServices.js";


// ========== HÀM CON CHO VALIDATION ===============
export function checkFullname(fullname) {
    if (!fullname || typeof fullname !== "string") {
        return false;
    }

    const words = fullname
        .trim()
        .split(/\s+/); // xử lý nhiều khoảng trắng

    if (words.length < 2) {
        return false;
    }

    return words.every(word => word.length >= 2);
}




export function checkEmail(email) {
    if (!email || typeof email !== "string") {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email.trim());
}




export function checkUsername(username) {
  if (typeof username !== "string") return false;

  return username.length >= 5;
}



export function checkPassword(password) {
  if (typeof password !== "string") return false;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasLower && hasUpper && hasNumber && hasSpecial;
}



export function isEmailExisted(email) {
    return fakeUsers.some(
        user => user.email.toLowerCase() === email.trim().toLowerCase()
    );
}



export function isUsernameExisted(username) {
    return fakeUsers.some(
        user => user.username.toLowerCase() === username.trim().toLowerCase()
    );
}









// ======= HÀM CON CHO TOKEN ===========

export function createToken() {
    return `token-${Date.now()}`; 
}


export function saveToken(token, userId) {
    localStorage.setItem(token, userId); 
}

export function getUserIdFromToken(token) {
    return Number(localStorage.getItem(token)); 
}

