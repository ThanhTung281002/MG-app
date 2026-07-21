console.log("services/services.js loaded");

const API_BASE_URL = "http://localhost:8000";

function getStoredToken() {
    return localStorage.getItem("accessToken");
}

function createHeaders({ token, hasBody }) {
    const headers = {};

    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

async function readResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    const text = await response.text();
    return text ? { message: text } : {};
}

function getErrorMessage(data, fallback) {
    if (!data) {
        return fallback;
    }

    if (typeof data.detail === "string") {
        return data.detail;
    }

    if (Array.isArray(data.detail)) {
        return data.detail.map(error => error.msg || JSON.stringify(error)).join(", ");
    }

    if (typeof data.message === "string") {
        return data.message;
    }

    return fallback;
}

async function request(path, options = {}) {
    const {
        method = "GET",
        body,
        token = getStoredToken(),
        auth = true
    } = options;

    const hasBody = body !== undefined;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: createHeaders({
            token: auth ? token : null,
            hasBody
        }),
        body: hasBody ? JSON.stringify(body) : undefined
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(getErrorMessage(data, `Request failed with status ${response.status}`));
    }

    return data;
}

function query(params) {
    return new URLSearchParams(params).toString();
}

export async function login(username, password) {
    return request("/auth/login", {
        method: "POST",
        auth: false,
        body: { username, password }
    });
}

export async function signup(fullname, email, username, password) {
    return request("/auth/signup", {
        method: "POST",
        auth: false,
        body: { fullname, email, username, password }
    });
}

export async function getMe(token) {
    return request("/auth/me", { token });
}

export async function getTeachingWordReflection() {
    return request("/teaching-words/reflection");
}

export async function getTeachingWord(id) {
    return request(`/teaching-words/${encodeURIComponent(id)}`);
}

export async function getLifeLessonsReflectionReflection() {
    return request("/life-lessons-reflection/reflection");
}

export async function getLifeLessonReflection(id) {
    return request(`/life-lessons-reflection/${encodeURIComponent(id)}`);
}

export async function getActivePurposes() {
    const data = await request("/purposes?view=basic");

    return {
        activePurposes: data.activePurposes ?? data.purposes ?? []
    };
}

export async function getPurpose(id) {
    return request(`/purposes/${encodeURIComponent(id)}`);
}

export async function getActions(id) {
    return request(`/purposes/${encodeURIComponent(id)}/actions`);
}

export async function getUnresolvedNotes() {
    return request("/notes/unresolved");
}

export async function getNote(id) {
    return request(`/notes/${encodeURIComponent(id)}`);
}

export async function getBornEntities(type, id) {
    return request(`/relations/born?${query({ type, id })}`);
}

export async function purposeFreeWrite(type, id, purposeContext, hopeContext) {
    return request("/purposes/free-write", {
        method: "POST",
        body: {
            originContext: { type, id },
            title: purposeContext,
            hope: hopeContext
        }
    });
}

export async function noteFreeWrite(type, id, context) {
    return request("/notes/free-write", {
        method: "POST",
        body: {
            originContext: { type, id },
            content: context
        }
    });
}

export async function updateLifeLessonReflection(id, reflection) {
    return request(`/life-lessons-reflection/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { reflection }
    });
}

export async function updatePurpose(id, title, hope, status) {
    return request(`/purposes/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { title, hope, status }
    });
}

export async function updateAction(purposeId, actionId, context, status) {
    return request(`/purposes/${encodeURIComponent(purposeId)}/actions/${encodeURIComponent(actionId)}`, {
        method: "PUT",
        body: { context, status }
    });
}

export async function addAction(purposeId, context) {
    return request(`/purposes/${encodeURIComponent(purposeId)}/actions`, {
        method: "POST",
        body: { context }
    });
}

export async function updateNote(id, content, type) {
    return request(`/notes/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { content, type }
    });
}

export async function deleteNote(id) {
    return request(`/notes/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
}

export async function getAllTeachingWords() {
    return request("/teaching-words?view=basic");
}

export async function getAllLifeLessonsReflection() {
    return request("/life-lessons-reflection?view=basic");
}

export async function getPendingUsers() {
    return request("/admin/pending-users");
}

export async function getRejectedUsers() {
    return request("/admin/rejected-users");
}

export async function getUser(id) {
    return request(`/admin/users/${encodeURIComponent(id)}`);
}

export async function updateUserStatus(id, status) {
    return request(`/admin/users/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { status }
    });
}

export async function updateTeachingWord(id, title, content, date) {
    return request(`/teaching-words/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { title, content, date }
    });
}

export async function getAllLifeLessonsMain() {
    return request("/life-lessons-main?view=basic");
}

export async function getLifeLessonMain(id) {
    return request(`/life-lessons-main/${encodeURIComponent(id)}`);
}

export async function updateLifeLessonMain(id, mainContent) {
    return request(`/life-lessons-main/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: { mainContent }
    });
}

export async function addTeachingWord(title, date, content) {
    return request("/teaching-words", {
        method: "POST",
        body: { title, content, date }
    });
}
