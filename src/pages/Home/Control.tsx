import { getFilesRecursively } from "@/apis/files";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Progress,
  ScrollArea,
  toast,
} from "@/components";
import { Toggle } from "@/components/ui/toggle";
import { CLASS_MODES } from "@/constants";
import { useBoolean } from "@/hooks";
import { shallow, useFoldersStore } from "@/store";
import { usePlayerStore } from "@/store/playerStore";
import { useSessionStore } from "@/store/sessionStore";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen, Save, Shuffle, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

type Props = {};

export default function Control({}: Props) {
  const navigate = useNavigate();
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  const setFolders = useFoldersStore((state) => state.setFolders);
  const [index, setIndex] = usePlayerStore(
    (state) => [state.index, state.setIndex],
    shallow,
  );
  const [shuffle, setShuffle] = usePlayerStore(
    (state) => [state.shuffle, state.setShuffle],
    shallow,
  );
  const setIntervals = usePlayerStore((state) => state.setIntervals);
  const playMode = usePlayerStore((state) => state.playMode);

  const progress = Math.floor(((index + 1) / files.length) * 100);
  const progressVal =
    files.length && index ? (progress > 100 ? 100 : progress) : 0;

  const handleStart = () => {
    if (playMode === "fixed" || playMode === "quantity") {
      setIntervals([
        {
          timer: usePlayerStore.getState().timer,
          imagesToPlay:
            playMode === "fixed"
              ? files.length
              : usePlayerStore.getState().imagesToDraw,
          break: {},
        },
      ]);
    } else if (playMode === "class") {
      setIntervals(CLASS_MODES[usePlayerStore.getState().classModeLength]);
    }
    navigate("/player");
  };

  // const loadSession = async () => {
  //   // if there are already uploaded files don't update the session
  //   const session = await getSessionData();
  //   const progress = await getProgress();
  //   if (progress.index) setIndex(progress.index);
  //   if (session.shuffle) setShuffle(session.shuffle);
  //   const loadingToast = toast.loading("Adding Files... ");
  //   if (progress.folders) {
  //     const folders = await getFilesRecursively(progress.folders);

  //     folders?.forEach((item) => {
  //       addFolder(item);
  //     });
  //   }
  //   toast.success("Added Files Successfully", {
  //     id: loadingToast,
  //   });
  // };

  const reset = async () => {
    setIndex(0);
    setFolders([]);
    setShuffle({
      isShuffle: false,
      seed: 0,
    });
  };

  return (
    <div className="space-y-8 py-10">
      <Button disabled={!files.length} onClick={handleStart} className="w-full">
        <Pen className="me-2 h-4 w-4" />
        Start
      </Button>
      <div className="flex gap-4">
        <LoadSessionsDialog />
        <SaveSessionDialog filesLength={files.length} />

        <Button variant={"outline"} onClick={reset}>
          Reset
        </Button>
        <Toggle
          onPressedChange={(val) =>
            setShuffle({
              isShuffle: val,
              seed: 0,
            })
          }
          pressed={shuffle.isShuffle}
        >
          <Shuffle className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Progress
            </span>
          </div>
        </div>
        <Progress value={progressVal} />
      </div>
    </div>
  );
}

function LoadSessionsDialog() {
  const isOpen = useBoolean(false);
  const [parent] = useAutoAnimate();
  const sessions = useSessionStore((state) => state.sessions);
  const removeSession = useSessionStore((state) => state.removeSession);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const setFolders = useFoldersStore((state) => state.setFolders);

  const handleSaveSession = async (id: string, foldersPaths: string[]) => {
    const loadingToast = toast.loading("Loading Session");
    const folders = await getFilesRecursively(foldersPaths);
    if (folders?.length) {
      setFolders(folders);
      setSessionId(id);
      toast.success("Session Loaded", {
        id: loadingToast,
      });
    } else {
      toast.error("Something went wrong", {
        id: loadingToast,
      });
    }
  };

  return (
    <Dialog open={isOpen.value} onOpenChange={isOpen.setValue}>
      <DialogTrigger asChild>
        <Button
          // disabled={!!files.length}
          className="w-full"
        >
          Load Session
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Load a session</DialogTitle>
          <DialogDescription>
            choose a session to load it and continue where you left off
          </DialogDescription>
        </DialogHeader>

        <ScrollArea>
          <div ref={parent} className="my-3 max-h-[30rem] space-y-2">
            {sessions.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <CardDescription className="flex">
                    folders: &nbsp;
                    {item.folders.map((folder, index) => (
                      <span className="group " key={index}>
                        <span className="inline group-first-of-type:hidden">
                          ,&nbsp;
                        </span>
                        {folder.name}
                      </span>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm"></CardContent>
                <CardFooter className="gap-4">
                  <Button
                    onClick={() => {
                      handleSaveSession(
                        item.id,
                        item.folders.map((item) => item.path),
                      );
                      isOpen.setFalse();
                    }}
                    variant={"outline"}
                  >
                    Select
                  </Button>
                  {item.id === "DEFAULT" && (
                    <Button
                      onClick={() => {
                        removeSession(item.id);
                      }}
                      variant={"outline"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const saveSessionSchema = z.object({
  sessionName: z.string().nonempty(),
});

function SaveSessionDialog({ filesLength }: { filesLength: number }) {
  const isOpen = useBoolean(false);
  const addSession = useSessionStore((state) => state.addSession);
  const form = useForm<{
    sessionName: string;
  }>({
    defaultValues: {
      sessionName: "",
    },
    mode: "onTouched",
    resolver: zodResolver(saveSessionSchema),
  });
  console.log(form.formState.errors);

  return (
    <Dialog open={isOpen.value} onOpenChange={isOpen.setValue}>
      <DialogTrigger asChild>
        <Button disabled={!filesLength} variant={"outline"}>
          <Save className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save current session</DialogTitle>
          <DialogDescription>
            Save your current session so you can load them whenever you want
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formData) => {
              addSession({
                name: formData.sessionName,
                folders: useFoldersStore.getState().folders,
                id: nanoid(),
              });
              toast.success("Saved Session");
              form.reset();
              isOpen.setFalse();
            })}
          >
            <FormField
              control={form.control}
              name="sessionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hands" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-32">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
