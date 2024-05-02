import PlayerLive from "./playerLive";

export default async function Page() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-50">
      <PlayerLive />
    </div>
  );
}
