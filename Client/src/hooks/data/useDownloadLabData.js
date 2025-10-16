import { useState } from 'react';
import { getDownloadLabData } from '@/services/data.service';
import { exportToCsv } from '@/lib/downloadFile';
import { useToast } from '../use-toast';
import createFilterBody from '@/lib/createFilterBody';

export const useDownloadLabData = ({ toggleValue, setSelectedLabs }) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadCsv = async (selectedLabs) => {
    if (selectedLabs.length === 0) {
      toast({
        title: "Please select at least one lab",
        variant: "destructive",
      });
      return;
    }
    
    setDownloading(true);
    
    try {
      const filterBody = createFilterBody(toggleValue);
      const data = await getDownloadLabData(selectedLabs, filterBody);
      exportToCsv(data);
    } catch (error) {
      toast({
        title: "Error downloading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSelectedLabs([]);
      setDownloading(false);
    }
  };

  // const handleDownloadJson = async (selectedLabs) => {
  //   if (selectedLabs.length === 0) {
  //     toast({
  //       title: "Please select at least one lab",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   setDownloading(true);
    
  //   try {
  //     const data = await getDownloadLabData(selectedLabs);
  //     exportToJson(data);
  //   } catch (error) {
  //     toast({
  //       title: "Error downloading data",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setSelectedLabs([]);
  //     setDownloading(false);
  //   }
  // };

  return {
    downloading,
    handleDownloadCsv,
  };
}; 