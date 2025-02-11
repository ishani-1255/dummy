import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = ({
  children,
  ...props
}) => (
  <DialogPrimitive.Portal {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
)

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className="fixed z-50 grid w-full gap-4 rounded-lg border bg-white p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className="flex flex-col space-y-1.5 text-center sm:text-left"
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="text-lg font-semibold leading-none tracking-tight"
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className="text-sm text-gray-500"
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName



// Base UI Components
const Card = ({ className, children }) => {
    return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>;
  };
  
  const CardHeader = ({ className, children }) => {
    return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
  };
  const CardHeader1 = ({ className, children }) => {
    return <div className={`flex space-y-1.5 p-6 ${className}`}>{children}</div>;
  };
  
  const CardTitle = ({ className, children }) => {
    return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
  };
  
  const CardContent = ({ className, children }) => {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
  };
  
  const Accordion = ({ type = "single", collapsible = false, className, children }) => {
    return <div className={`space-y-1 ${className}`}>{children}</div>;
  };
  
  const AccordionItem = ({ value, className, children }) => {
    return <div className={`border-b ${className}`} data-value={value}>{children}</div>;
  };
  
  const AccordionTrigger = ({ className, children }) => {
    return (
      <div className={`flex items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}>
        {children}
      </div>
    );
  };
  
  const AccordionContent = ({ className, children }) => {
    return <div className={`overflow-hidden text-sm transition-all ${className}`}>{children}</div>;
  };
  
  const Table = ({ className, children }) => {
    return <div className={`w-full overflow-auto ${className}`}><table className="w-full caption-bottom text-sm">{children}</table></div>;
  };
  
  const TableHeader = ({ className, children }) => {
    return <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;
  };
  
  const TableBody = ({ className, children }) => {
    return <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
  };
  
  const TableHead = ({ className, children }) => {
    return <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
  };
  
  const TableRow = ({ className, children }) => {
    return <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr>;
  };
  
  const TableCell = ({ className, children }) => {
    return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;
  };
  
  // Export all components
  export {
    Card,
    CardHeader,
    CardHeader1,
    CardTitle,
    CardContent,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  };