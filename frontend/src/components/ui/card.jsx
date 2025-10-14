export function Card({ children, className = "" }) {
    return <div className={`bg-white rounded-xl shadow-sm border p-4 ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="border-b pb-2 mb-2">{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
  }
  
  export function CardContent({ children }) {
    return <div className="mt-2">{children}</div>;
  }
  