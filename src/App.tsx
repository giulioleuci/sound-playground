import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Module1 from "./pages/Module1";
import Module2 from "./pages/Module2";
import Module3 from "./pages/Module3";
import Module4 from "./pages/Module4";
import Module5 from "./pages/Module5";
import Module6 from "./pages/Module6";
import Module7 from "./pages/Module7";
import Module8 from "./pages/Module8";
import Module9 from "./pages/Module9";
import Module10 from "./pages/Module10";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/modulo-1" element={<Module1 />} />
          <Route path="/modulo-2" element={<Module2 />} />
          <Route path="/modulo-3" element={<Module3 />} />
          <Route path="/modulo-4" element={<Module4 />} />
          <Route path="/modulo-5" element={<Module5 />} />
          <Route path="/modulo-6" element={<Module6 />} />
          <Route path="/modulo-7" element={<Module7 />} />
          <Route path="/modulo-8" element={<Module8 />} />
          <Route path="/modulo-9" element={<Module9 />} />
          <Route path="/modulo-10" element={<Module10 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
