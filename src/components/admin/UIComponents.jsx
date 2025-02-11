// Base UI Components
const Card = ({ className, children }) => {
    return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>;
  };
  
  const CardHeader = ({ className, children }) => {
    return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
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
    TableCell
  };