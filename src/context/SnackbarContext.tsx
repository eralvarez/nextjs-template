"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineClose } from "react-icons/ai";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    variant?: "success" | "error" | "warning" | "info"
  ) => void;
}

interface SnackbarProviderProps {
  children: ReactNode;
}

type SnackbarVariantType = "success" | "error" | "warning" | "info";

interface SnackbarState {
  show: boolean;
  message: string;
  variant: SnackbarVariantType;
}

const snackbarVariantClassMap: Record<SnackbarVariantType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-500 text-white",
  info: "bg-slate-700 text-white",
  warning: "bg-orange-400 text-white",
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

const SNACKBAR_TIMER = 5000;

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: "",
    variant: "info",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, show: false }));
  };

  const showSnackbar = useCallback(
    (message: string, variant: SnackbarVariantType = "info") => {
      setSnackbar({ show: true, message, variant });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        handleSnackbarClose();
        timerRef.current = null;
      }, SNACKBAR_TIMER);
    },
    []
  );

  useEffect(() => {
    // Clean up the timer when the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <div
        className={`${snackbarVariantClassMap[snackbar.variant]} ${
          !snackbar?.show ? "translate-x-[120%]" : ""
        } ${
          snackbar?.show ? "translate-x-0" : ""
        } transition-transform bottom-4 right-0 lg:right-4 fixed flex justify-between gap-2 items-center shadow-lg p-4 rounded-lg w-full lg:max-w-96`}
      >
        <div className="flex-grow">
          <span>{snackbar?.message}</span>
        </div>
        <div className="flex items-center">
          <div
            className="hover:bg-black/20 p-1 rounded-full cursor-pointer"
            onClick={handleSnackbarClose}
          >
            <AiOutlineClose />
          </div>
        </div>
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
