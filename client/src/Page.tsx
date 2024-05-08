import { Button } from "./ui/button";
import { ArrowLeft, PhoneCall } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

import { useEffect, useRef } from "react";
import PreCallSettings from "./videocall/components/PreCallSettings";

const Page = () => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden">
      <Header />
      <Chat />
    </div>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="secondary" size="icon" className="rounded-full">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <PhoneCall className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Call settings</DialogTitle>
            <DialogDescription>
              You will be able to change your microphone and camera settings
              once you are in the call.
            </DialogDescription>
          </DialogHeader>
          <PreCallSettings />
          <DialogFooter>
            <Button type="submit" className="w-full">
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

const Chat = () => {
  const messagesAmount = 15;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, []); // Ensures this runs only once after the initial render

  return (
    <div
      ref={ref}
      className="flex flex-col gap-5 p-4 overflow-auto max-h-[calc(100vh-128px)]"
    >
      {Array.from({ length: messagesAmount }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center space-x-4 ${
            index % 2 === 0 ? "self-end flex-row-reverse" : "self-start"
          }`}
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
