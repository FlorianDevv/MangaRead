import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GET as GET_CURRENT } from "../api/live/current/route";
import { GET as GET_SCHEDULE } from "../api/live/route";
import { MobileNavbarComponent } from "../components/mobilenavbar";
export const dynamic = "force-dynamic";
interface Item {
  title: string;
  season: number;
  episode: number;
  start: number;
  realStartTime: number;
  startTime: string;
  duration: number;
  elapsedTime: number;
}
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

  const groupedItems = upcomingSchedule.reduce((groups, item) => {
    const date = new Date(item.realStartTime).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
  const typedGroupedItems = groupedItems as Record<string, Item[]>;

  return (
    <MobileNavbarComponent activePage="Live">
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="flex flex-row items-center justify-center space-x-2">
          <Link href="/live/video">
            <Card className="flex flex-col items-center justify-center rounded  hover:scale-105 transform transition-transform duration-300 ease-in-out border">
              <CardHeader className="text-center">
                <div className="relative mt-2">
                  <Image
                    src={`/${current.title}/anime/Season01/01-001.webp`}
                    width={200}
                    height={200}
                    alt={current.title}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 bg-red-600 rounded-lg mb-2 w-20 animate-pulse">
                    LIVE
                  </div>
                </div>
                <CardTitle className="font-bold text-lg mb-2">
                  {current.title}
                </CardTitle>
                <CardDescription className="flex flex-col items-center justify-center">
                  <span>Season: {current.season}</span>
                  <span>Episode: {current.episode}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <span className="flex flex-row space-x-2">
                  <CalendarClock />
                  {new Date(current.realStartTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(
                    current.realStartTime + current.duration * 1000
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <Progress
                  value={(current.elapsedTime / current.duration) * 100}
                  max={100}
                />
              </CardContent>
            </Card>
          </Link>
          test
        </div>
        <div className="overflow-x-auto max-w-full">
          <h2>Planning</h2>
          <div className="grid grid-flow-col gap-4 md:mx-8 mx-2">
            {Object.entries(typedGroupedItems).map(
              ([date, items]: [string, Item[]], index: number) => (
                <ul
                  key={index}
                  className="flex flex-col space-y-4 rounded p-2  border border-gray-500 "
                >
                  <h3 className="text-sm 2xl:text-lg font-bold text-center">
                    {new Date(
                      date.split("/").reverse().join("-")
                    ).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                  {items.map((item: Item, index: number) => (
                    <Card
                      key={index}
                      className="flex flex-col rounded border border-gray-900"
                    >
                      <CardHeader>
                        <CardTitle className="font-bold text-lg mb-2 relative h-80 w-44">
                          <Image
                            src={`/${item.title}/anime/Season01/01-001.webp`}
                            fill
                            className="object-cover"
                            alt={item.title}
                          />
                          <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm">
                            {item.title}
                          </p>
                        </CardTitle>
                        <CardDescription className="flex flex-col items-center justify-center">
                          <span>Season: {item.season}</span>
                          <span>Episode: {item.episode}</span>
                          <span className="flex flex-row space-x-2">
                            <CalendarDays />
                            {new Date(item.realStartTime)
                              .toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(":", "h")}
                            -
                            {new Date(item.realStartTime + item.duration * 1000)
                              .toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(":", "h")}
                          </span>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
