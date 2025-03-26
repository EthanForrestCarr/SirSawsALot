import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../../styles/Button.css";

interface DownloadPDFButtonProps {
  invoice: any;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ invoice }) => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    element.classList.add('pdf-style');
    
    try {
      const canvas = await html2canvas(element, { scale: 5 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.id}.pdf`);
    } finally {
      element.classList.remove('pdf-style');
    }
  };

  return (
    <button onClick={handleDownloadPDF} className="btn btn-download">
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;
