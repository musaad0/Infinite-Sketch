import { useWindowVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";

import { usePlayerStore } from "@/store/playerStore";

import { IFile } from "@/models";
import { cn } from "@/utils";

export const RowVirtualizerDynamicWindow = ({ files }: { files: IFile[] }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const index = usePlayerStore((state) => state.index);

  const parentOffsetRef = React.useRef(0);

  React.useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: files.length,
    overscan: 8,
    estimateSize: React.useCallback(() => 400, []),
    scrollMargin: parentOffsetRef.current,
  });

  const items = virtualizer.getVirtualItems();

  // const [paddingTop, paddingBottom] =
  //   items.length > 0
  //     ? [
  //         Math.max(0, items[0].start - virtualizer.options.scrollMargin),
  //         Math.max(0, virtualizer.getTotalSize() - items[items.length - 1].end),
  //       ]
  //     : [0, 0];

  React.useEffect(() => {
    virtualizer.scrollToIndex(index);
  }, [index]);

  return (
    <div ref={parentRef}>
      <div
        style={{
          // height: virtualizer.getTotalSize(),
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            // paddingTop,
            // paddingBottom,
            height: "100vh",
            left: 0,
            width: "100%",
            transform: `translateY(${
              items[0].start - virtualizer.options.scrollMargin
            }px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              <div className={cn("h-screen")}>
                {/* <img
                  className="h-full max-w-full object-contain mx-auto"
                  src={files[virtualRow.index].path}
                /> */}
                <img
                  src={files?.[index].path}
                  className={`mx-auto h-screen max-w-full object-contain 
              `}
                />
                {/* <Avatar>
                  <AvatarImage
                    className="h-full max-w-full object-contain mx-auto"
                    src={files[virtualRow.index].path}
                  />
                  <AvatarFallback className="h-full max-w-full object-contain mx-auto">
                    <Pen className="animate-spin" />
                  </AvatarFallback>
                </Avatar> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// function ColumnVirtualizerDynamic() {
//   const parentRef = React.useRef<HTMLDivElement | null>(null);

//   const virtualizer = useVirtualizer({
//     horizontal: true,
//     count: sentences.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 45,
//   });

//   return (
//     <>
//       <div
//         ref={parentRef}
//         className="List"
//         style={{ width: 400, height: 400, overflowY: "auto" }}
//       >
//         <div
//           style={{
//             width: virtualizer.getTotalSize(),
//             height: "100%",
//             position: "relative",
//           }}
//         >
//           {virtualizer.getVirtualItems().map((virtualColumn) => (
//             <div
//               key={virtualColumn.key}
//               data-index={virtualColumn.index}
//               ref={virtualizer.measureElement}
//               className={
//                 virtualColumn.index % 2 ? "ListItemOdd" : "ListItemEven"
//               }
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 height: "100%",
//                 transform: `translateX(${virtualColumn.start}px)`,
//               }}
//             >
//               <div style={{ width: sentences[virtualColumn.index].length }}>
//                 <div>Column {virtualColumn.index}</div>
//                 <div>{sentences[virtualColumn.index]}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
