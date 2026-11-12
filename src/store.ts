import { useEffect, useState } from "react";
import type { Estimate } from "./data";

export type Booking = {
  id: string;
  createdAt: string;
  truckId: string;
  truckName: string;
  org: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  siteAddress: string;
  purpose: string;
  startDate: string;
  days: number;
  avgLoadKw: number;
  hoursPerDay: number;
  priority: "Planned" | "Emergency";
  estimate: Estimate;
  status: "Awaiting payment" | "Confirmed" | "En route" | "On site" | "Completed" | "Cancelled";
  paid: number;
  paymentMethod?: string;
  txnId?: string;
  usedKwh: number;
};

const KEY = "gocore.bookings.v1";

function load(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(load);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookings));
  }, [bookings]);

  const add = (b: Booking) => setBookings((p) => [b, ...p]);
  const update = (id: string, patch: Partial<Booking>) =>
    setBookings((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const remove = (id: string) => setBookings((p) => p.filter((b) => b.id !== id));
  return { bookings, add, update, remove };
}

export function newId() {
  return "GC-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Date.now().toString().slice(-4);
}
