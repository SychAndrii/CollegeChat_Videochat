import VideoCallProvider from "./videocall/providers/LobbyProvider";
import DevicesProvider from "./devices/DevicesProvider";
import Page from "./Page";

function Layout() {
  return (
    <DevicesProvider>
      <VideoCallProvider>
        <div>
          <Page />
        </div>
      </VideoCallProvider>
    </DevicesProvider>
  );
}

export default Layout;
