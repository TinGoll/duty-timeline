import Timeline, {
  type TimelineGroupBase,
  type TimelineItemBase,
} from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import styled from "@emotion/styled";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState, type FC } from "react";
dayjs.extend(utc);


// Типы
interface Group extends TimelineGroupBase {
  id: number;
  title: string;
}

interface Item extends TimelineItemBase<Dayjs> {
  id: number | string;
  group: number;
  title: string;
  start_time: dayjs.Dayjs;
  end_time: dayjs.Dayjs;
}

// Пример сотрудников
const groups: Group[] = [
  { id: 1, title: "Евгений Лызов" },
  { id: 2, title: "Евгений Персиенко" },
  { id: 3, title: "Общий таймлайн" }, // Используется как агрегатор
];

// Начальное состояние элементов (без общего таймлайна)
const baseItems: Item[] = [
  {
    id: 1,
    group: 1,
    title: "ealyzov",
    start_time: dayjs("2025-06-01"),
    end_time: dayjs("2025-06-03"),
    isOverlay: true
  },
  {
    id: 2,
    group: 2,
    title: "epersienko",
    start_time: dayjs("2025-06-02"),
    end_time: dayjs("2025-06-05"),
  },
];

const DutyItem = styled.div`
  background-color: #2e7d32;
  color: #fff;
  border-radius: 4px;
  height: 100%;
  padding: 2px 4px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

const renderItem = ({
  item,
  getItemProps,
}: {
  item: Item;
//   getItemProps: () => React.HTMLAttributes<HTMLDivElement>;
  getItemProps: any;
}) => {
  return <DutyItem key={item.id} {...getItemProps()}>{item.title}</DutyItem>;
};


export const DutyTimeline: FC = () => {
  const [items, setItems] = useState<Item[]>(baseItems);
  const [visibleTimeStart, setVisibleTimeStart] = useState<number>(
    dayjs("2025-05-30").valueOf()
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number>(
    dayjs("2025-06-07").valueOf()
  );

  const updateSummary = (allItems: Item[]): Item[] => {
    const summaryItems: Item[] = allItems.map((item) => ({
      ...item,
      id: `${item.id}-summary`,
      group: 3,
      title: `${item.title} (summary)`,
    }));
    return [...allItems, ...summaryItems];
  };

  const shiftFollowingItems = (movedItem: Item, allItems: Item[]): Item[] => {
    const updated: Item[] = allItems.map((item) => {
      if (
        item.group === movedItem.group &&
        item.start_time.isAfter(movedItem.start_time) &&
        item.id !== movedItem.id
      ) {
        const duration = item.end_time.diff(item.start_time);
        const newStart = movedItem.end_time;
        return {
          ...item,
          start_time: newStart,
          end_time: newStart.add(duration),
        };
      }
      return item;
    });
    return updated;
  };

  const handleItemMove = (
    itemId: number | string,
    dragTime: number,
    newGroupOrder: number
  ) => {
    const groupId = groups[newGroupOrder].id;
    const itemToMove = items.find((item) => item.id === itemId);
    if (!itemToMove) return;

    const duration = itemToMove.end_time.diff(itemToMove.start_time);
    const newStart = dayjs(dragTime);
    const newEnd = newStart.add(duration);

    const updatedItem: Item = {
      ...itemToMove,
      start_time: newStart,
      end_time: newEnd,
      group: groupId,
    };

    const otherItems = items.filter((item) => item.id !== itemId);
    const shiftedItems = shiftFollowingItems(updatedItem, otherItems);
    setItems([...shiftedItems, updatedItem]);
  };

  console.log('items', items);
  

  const handleItemResize = (
    itemId: number | string,
    time: number,
    edge: "left" | "right"
  ) => {
    const resizedItem = items.find((item) => item.id === itemId);
    if (!resizedItem) return;

    const updatedItem: Item = {
      ...resizedItem,
      [edge === "left" ? "start_time" : "end_time"]: dayjs(time),
    };

    const otherItems = items.filter((item) => item.id !== itemId);
    const shiftedItems = shiftFollowingItems(updatedItem, otherItems);
    setItems([...shiftedItems, updatedItem]);
  };

  const handleTimeChange = (start: number, end: number) => {
    setVisibleTimeStart(start);
    setVisibleTimeEnd(end);
  };

  const allItems = updateSummary(items);

  return (
    <div>
      <h2>Duty Timeline</h2>
      <Timeline
        groups={groups}
        items={allItems}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        onTimeChange={handleTimeChange}
        canMove
        canResize="both"
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        itemRenderer={(props) => {
            return renderItem(props);
        }}
      />
    </div>
  );
};
