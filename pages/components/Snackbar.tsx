import { FC, useEffect, useRef } from "react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@heroicons/react/solid";
import { SNACKBAR_DURATION } from "../constants";

interface SnackbarProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export const Snackbar: FC<SnackbarProps> = ({ type, message, onClose }) => {
  const timeoutId = useRef<number>();

  useEffect(() => {
    timeoutId.current = window.setTimeout(() => {
      onClose();
    }, SNACKBAR_DURATION);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [onClose]);

  return (
    <div className="fixed left-1/2 bottom-16 w-full -translate-x-1/2 px-4">
      <div className="rounded-md bg-gray-800 max-w-xl mx-auto w-full p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            {type === "success" ? (
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            ) : (
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
