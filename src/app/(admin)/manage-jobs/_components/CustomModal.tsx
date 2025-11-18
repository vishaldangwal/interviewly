import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CustomModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  title = "",
}: any) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent
      className={`max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-blue-600/30 rounded-3xl shadow-2xl shadow-blue-600/20 ${className}`}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">
          {title}
        </DialogTitle>
      </DialogHeader>
      <div className="max-h-[70vh] overflow-y-auto">{children}</div>
    </DialogContent>
  </Dialog>
);

export default CustomModal;
