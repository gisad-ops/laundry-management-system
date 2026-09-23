import api from "./api";

export const getPayments = () => api.get("/payments").then((r) => r.data);
export const recordPayment = (data) => api.post("/payments", data).then((r) => r.data);