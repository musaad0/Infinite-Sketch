import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePlayerStore } from "@/store";
import { prettifyNumber } from "@/utils";
import { Clock, DollarSign, ImagePlus } from "lucide-react";
import React from "react";

type Props = {};

function prettifyTime(seconds: number) {
  const result = new Date(seconds * 1000).toISOString().slice(11, 19);
  return result;
}

export default function Stats({}: Props) {
  const [timeSpentDrawing, totalImagesDrawn] = usePlayerStore((state) => [
    state.totalTimePlayed,
    state.imagesSeen,
  ]);
  return (
    <div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            Your Stats
          </span>
        </div>
      </div>
      <div className="space-y-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Drew</CardTitle>
            <ImagePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prettifyNumber(totalImagesDrawn)}
            </div>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {prettifyNumber(timeSpentDrawing)} */}
              {prettifyTime(timeSpentDrawing)}
            </div>
            <p className="text-xs text-muted-foreground">Drawing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
