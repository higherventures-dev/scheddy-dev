import { Plus } from "lucide-react";
//import { Card, CardContent } from "@/components/ui/card";

interface AddNewButtonProps {
  onClick?: () => void;
}

export  const AddNewButton = ({ onClick }: AddNewButtonProps) => {
  return (
    // <Card
    //   onClick={onClick}
    //   className="cursor-pointer hover:shadow-md transition duration-300 ease-in-out rounded-2xl border-dashed border-2 border-muted p-4 flex items-center justify-center h-full"
    // >
    //   <CardContent className="flex flex-col items-center justify-center text-muted-foreground p-0">
    //     <div className="bg-muted p-3 rounded-xl mb-2">
    //       <Plus className="w-6 h-6" />
    //     </div>
    //     <p className="text-sm font-medium">Add New</p>
    //   </CardContent>
    // </Card>
  );
};