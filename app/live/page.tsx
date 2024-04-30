import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { GET as GET_CURRENT } from "../api/live/current/route";
import { GET as GET_SCHEDULE } from "../api/live/route";
import { MobileNavbarComponent } from "../components/mobilenavbar";
export const dynamic = "force-dynamic";
export default async function Page() {
  const responseSchedule = await GET_SCHEDULE();
  const schedule: any[] = await responseSchedule.json();
  const responseCurrent = await GET_CURRENT();
  const current: any = await responseCurrent.json();

  // Sort schedule by realStartTime
  const sortedSchedule = schedule.sort(
    (a, b) => a.realStartTime - b.realStartTime
  );

  // Find the index of current in the sorted schedule
  const currentIndex = sortedSchedule.findIndex(
    (item) => item.realStartTime === current.realStartTime
  );

  // Get the schedule from the next item onwards
  const upcomingSchedule =
    currentIndex >= 0 ? sortedSchedule.slice(currentIndex + 1) : sortedSchedule;

  return (
    <MobileNavbarComponent activePage="Live">
      <div className="flex flex-col items-center justify-center py-2">
        <Link href="/live/video">
          <Button className="mb-4">Watch Live</Button>
        </Link>
        <h2>Currently Playing</h2>
        <div className="flex flex-col items-center bg-gray-900 rounded shadow p-4">
          <div className="bg-red-500 text-xs px-2 py-1 rounded-md mb-2">
            LIVE
          </div>
          <Image
            src={`/${current.title}/anime/Season01/01-001.webp`}
            width={200}
            height={200}
            alt={current.title}
          />
          <span className="font-bold text-lg mb-2">{current.title}</span>
          <span>Season: {current.season}</span>
          <span>Episode: {current.episode}</span>
          <span>
            Start Time:{" "}
            {new Date(current.realStartTime).toLocaleDateString("fr", {
              weekday: "long",
            })}{" "}
            {new Date(current.realStartTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>
            Broadcast Time:
            {new Date(current.realStartTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -
            {new Date(
              current.realStartTime + current.duration * 1000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Progress
            value={(current.elapsedTime / current.duration) * 100}
            max={100}
          />
          <span>
            Time Remaining: -
            {`${Math.floor((current.duration - current.elapsedTime) / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(
              (current.duration - current.elapsedTime) % 60
            )
              .toString()
              .padStart(2, "0")}`}
          </span>
        </div>
        <div className="overflow-x-auto max-w-full">
          <h2>Upcoming</h2>
          <ul className="flex flex-row space-x-4 shadow-md rounded px-8 pt-6 pb-8 mb-4 whitespace-nowrap">
            {upcomingSchedule.map((item, index) => (
              <li
                key={index}
                className="flex flex-col bg-gray-900 rounded shadow p-4"
              >
                <Image
                  src={`/${item.title}/anime/Season01/01-001.webp`}
                  width={200}
                  height={200}
                  alt={item.title}
                />
                <span className="font-bold text-lg mb-2">{item.title}</span>
                <span>Season: {item.season}</span>
                <span>Episode: {item.episode}</span>
                <span>
                  Start Time:{" "}
                  {new Date(item.realStartTime).toLocaleDateString("fr", {
                    weekday: "long",
                  })}{" "}
                  {new Date(item.realStartTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
