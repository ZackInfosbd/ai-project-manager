import { getAccessTemporaryTokens } from "@/actions/getAccessTemporaryTokens";
import SchematicEmbed from "./SchematicEmbed";

const SchematicComponent = async ({
  componentId,
}: {
  componentId?: string;
}) => {
  if (!componentId) {
    return null;
  }

  const accessToken = await getAccessTemporaryTokens();

  if (!accessToken) {
    throw new Error("No access token found for user");
  }

  console.log("accessToken", accessToken);

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
};
export default SchematicComponent;
