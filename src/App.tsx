import type { FC } from "react";

import { DutyTimeline } from "./DutyTimeline";
// import { DutyTimelineBase } from "./DutyTimelineBase";


export const App: FC = () => {
  return (
    <div>
      {/* <DutyTimelineBase /> */}
      <DutyTimeline />
    </div>
  );
};
