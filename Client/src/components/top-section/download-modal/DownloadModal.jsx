import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { memo } from "react";
import { HiDownload } from "react-icons/hi";
import { useState } from "react";
import { useDownloadLabData } from "@/hooks/data/useDownloadLabData";
import PropTypes from "prop-types";
const DownloadModal = memo(function DownloadModal({ toggleValue, Labs }) {
  const [selectedLabs, setSelectedLabs] = useState([]);
  const { downloading, handleDownloadCsv } =
    useDownloadLabData({ toggleValue, setSelectedLabs });

  const handleLabSelection = (lab) => {
    setSelectedLabs((prev) => {
      if (prev.includes(lab)) {
        return prev.filter((l) => l !== lab);
      }
      return [...prev, lab];
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-normal h-7 rounded px-3 flex items-center gap-2">
        <HiDownload className="lg:block hidden"/>
        <span className="hidden lg:block">Download Scope</span>
        <span className="block lg:hidden">Download</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Download Lab Scope</AlertDialogTitle>
          <AlertDialogDescription>
            You can download the lab scope of these Labs
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-wrap gap-2">
          {Labs?.map((lab, index) => (
            <div
              key={index}
              className={`h-8 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  hover:cursor-pointer ${
                selectedLabs.includes(lab)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              }`}
              onClick={() => handleLabSelection(lab)}
            >
              {lab}
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSelectedLabs([])}>Close</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDownloadCsv(selectedLabs)}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download CSV"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

DownloadModal.propTypes = {
  toggleValue: PropTypes.string.isRequired,
  Labs: PropTypes.array.isRequired,
};

export default DownloadModal;
