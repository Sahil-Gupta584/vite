import { client } from "@/appwrite/clientConfig";
import { databaseId } from "@/appwrite/serverConfig";
import type { TLiveVisitor } from "@/lib/types";
import type {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
} from "react";
import { getLiveVisitors } from "../../-actions";

export async function getCoords(city: string, country: string) {
  const query = encodeURIComponent(`${city}, ${country}`);
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}`
  );
  const geo = await res.json();

  return geo.features[0]?.center || null;
}

export function toggleFullscreen(
  mapContainerRef: RefObject<HTMLDivElement>,
  setIsFullScreen: Dispatch<SetStateAction<boolean>>
) {
  const elem = mapContainerRef.current;

  if (!elem) return;

  if (!document.fullscreenElement) {
    elem.requestFullscreen();
    setIsFullScreen(true);
  } else {
    document.exitFullscreen();
    setIsFullScreen(false);
  }
}

export function spin(
  isSpinning: boolean,
  map: mapboxgl.Map,
  spinFrameRef: MutableRefObject<number | null>
) {
  if (!isSpinning) return;
  const center = map.getCenter();
  center.lng += 3;

  map.easeTo({
    center,
    duration: 1000,
    easing: (t) => t,
  });

  spinFrameRef.current = window.setTimeout(
    () => spin(isSpinning, map, spinFrameRef),
    1000
  );
}

export function formatSessionTime(lastEventTs: number | string) {
  const now = Date.now();
  const eventTime =
    typeof lastEventTs === "string"
      ? new Date(lastEventTs).getTime()
      : lastEventTs;
  const diff = Math.max(0, now - eventTime); // in ms

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}

export function subscribeToRealtime(
  $id: string,
  setLiveVisitors: Dispatch<SetStateAction<TLiveVisitor[]>>
) {
  getLiveVisitors($id).then((data) => {
    if (data) {
      setLiveVisitors(
        data.map((v) => ({
          sessionId: v.sessionId,
          visitorId: v.visitorId,
          $createdAt: v.$createdAt,
        }))
      );
    }
  });
  const event = `databases.${databaseId}.tables.heartbeats.rows`;
  client.subscribe(
    event,
    ({ payload, events }: { payload: TLiveVisitor; events: string[] }) => {
      if (events.includes(event + ".*.create")) {
        setLiveVisitors((prev) => {
          const exists = prev.some(
            (v) =>
              v.sessionId === payload.sessionId &&
              v.visitorId === payload.visitorId
          );

          if (exists) return prev;

          return [...prev, payload];
        });
      }

      if (events.includes(event + ".*.delete")) {
        setLiveVisitors((prev) =>
          prev.filter(
            (lv) =>
              lv.sessionId !== payload.sessionId &&
              lv.visitorId !== payload.visitorId
          )
        );
      }
    }
  );
}
