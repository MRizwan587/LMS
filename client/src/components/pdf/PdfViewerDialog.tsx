import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

export interface PdfViewerDialogProps {
  open: boolean;
  pdfUrl: string | null;
  onClose: () => void;
}

/**
 * PDF read dialog using an iframe.
 * We use iframe instead of @react-pdf-viewer because that library caused
 * "Invalid hook call" / "Cannot read properties of null (reading 'useMemo')"
 * (likely multiple React instances or hooks used at module init). The iframe
 * uses the browser’s built-in PDF viewer and avoids those issues.
 */
export function PdfViewerDialog({ open, pdfUrl, onClose }: PdfViewerDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      sx={{ '& .MuiDialog-paper': { width: '90vw', maxWidth: 960, height: '85vh' } }}
    >
      <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Read PDF</span>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
        {pdfUrl && (
          <iframe
            title="PDF viewer"
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none', minHeight: '75vh' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
