import { Separator } from "@workspace/ui/components/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { TypographyP } from "@workspace/ui/components/custom/typography";

export default function SettingsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <TypographyP className="text-gray-600">
          Settings will be available in a future update.
        </TypographyP>
      </CardContent>
    </Card>
  );
}
