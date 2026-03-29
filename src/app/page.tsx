import { MainApp } from "./MainApp";
import eventsData from "../../data/events.json";
import type { HistoryEvent } from "@/types";

const events: HistoryEvent[] = eventsData as HistoryEvent[];

export default function Home() {
  return <MainApp events={events} />;
}
