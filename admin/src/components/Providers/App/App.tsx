import { Toaster } from 'react-hot-toast';

interface iProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AppProvider({ children }: iProps) {
  return (
    <>
      <Toaster position="bottom-center" />
      {children}
    </>
  );
}
