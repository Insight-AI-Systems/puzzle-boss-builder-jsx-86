
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export function UserManagementHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center">
        <UserCog className="h-5 w-5 mr-2" />
        User Management
      </CardTitle>
      <CardDescription>
        Search and filter users by various criteria. For exact email matches, enter the complete email.
      </CardDescription>
    </CardHeader>
  );
}
