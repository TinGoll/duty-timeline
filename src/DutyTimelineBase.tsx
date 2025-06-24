import type { FC } from "react";
import dayjs from "dayjs";

import Timeline, { type TimelineGroupBase } from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import styled from "@emotion/styled";

interface Group extends TimelineGroupBase {
  id: number;
  title: string;
}

const groups: Group[] = [
  { id: 1, title: "Евгений Лызов" },
  { id: 2, title: "Евгений Персиенко" },
  { id: 3, title: "Дежурство" },
];

const items = [
  {
    id: 1,
    group: 1,
    title: "item 1",
    start_time: dayjs(),
    end_time: dayjs().add(1, "hour"),
    tip: 'additional information',
    color: 'rgb(158, 14, 206)',
    selectedBgColor: 'rgba(225, 166, 244, 1)',
    bgColor : 'rgba(225, 166, 244, 0.6)',
    
  },
  {
    id: 2,
    group: 2,
    title: "item 2",
    start_time: dayjs().add(-0.5, "hour"),
    end_time: dayjs().add(0.5, "hour"),
  },
  {
    id: 3,
    group: 1,
    title: "item 3",
    start_time: dayjs().add(2, "hour"),
    end_time: dayjs().add(3, "hour"),
  },
];

const itemRenderer = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps
}) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

  const result = getItemProps(item.itemProps);
  console.log('result', result);
  
  
  return (
    <div {...result} key={item.id}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
      >
        {itemContext.title}
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} style={{background: '#ffc107'}}/> : ''}
    </div>
  )}


export const DutyTimelineBase: FC = () => {
  return (
    <div>
      Настрой дежурство.
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={dayjs().add(-12, "hour").valueOf()}
        defaultTimeEnd={dayjs().add(12, "hour").valueOf()}
        canResize="right"
        itemRenderer={itemRenderer}
      />
    </div>
  );
};
