import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PropertiesPageContent from "@/components/property/PropertiesPageContent";

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32 text-mist">
          <Loader2 className="animate-spin" size={28} />
        </div>
      }
    >
      <PropertiesPageContent />
    </Suspense>
  );
}