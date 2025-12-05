// Notion API service functions

// Test Notion connection
export async function testNotionConnection() {
  try {
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Notion API key is not configured",
      };
    }

    // Make a request to the Notion API to test the connection
    const response = await fetch("https://api.notion.com/v1/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.message ||
          `Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error testing Notion connection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Fetch available Notion databases
export async function fetchNotionDatabases() {
  try {
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return { success: false, error: "Notion API key is not configured" };
    }

    const response = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { value: "database", property: "object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.message ||
          `Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, databases: data.results };
  } catch (error) {
    console.error("Error fetching Notion databases:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Types for Notion API responses
type NotionTextObject = { plain_text: string };
type NotionSelectObject = { name: string };
type NotionPersonObject = { id: string; name: string; avatar_url: string };
type NotionFileObject = { name: string; file?: { url: string }; external?: { url: string } };
type NotionRelationObject = { id: string };

type NotionPropertyValue = {
  type: string;
  title?: NotionTextObject[];
  rich_text?: NotionTextObject[];
  number?: number;
  select?: NotionSelectObject;
  multi_select?: NotionSelectObject[];
  date?: { start: string };
  checkbox?: boolean;
  url?: string;
  email?: string;
  phone_number?: string;
  formula?: {
    type: string;
    string?: string;
    number?: number;
    boolean?: boolean;
    date?: { start: string };
  };
  people?: NotionPersonObject[];
  files?: NotionFileObject[];
  relation?: NotionRelationObject[];
};

type NotionPageData = {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  properties: Record<string, NotionPropertyValue>;
};

// Helper function to transform Notion page data
export function transformNotionPageData(page: { 
  id: string; 
  created_time: string; 
  last_edited_time: string; 
  url: string; 
  properties: Record<string, unknown>; 
}) {
  const result: Record<string, unknown> = {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    url: page.url,
  };

  // Process each property based on its type
  for (const [propertyName, propertyValue] of Object.entries(page.properties)) {
    const property = propertyValue as NotionPropertyValue;

    switch (property.type) {
      case "title":
        result[propertyName] = property.title
          ?.map((t) => t.plain_text)
          .join("") || "";
        break;

      case "rich_text":
        result[propertyName] = property.rich_text
          ?.map((t) => t.plain_text)
          .join("") || "";
        break;

      case "number":
        result[propertyName] = property.number;
        break;

      case "select":
        result[propertyName] = property.select?.name || null;
        break;

      case "multi_select":
        result[propertyName] = property.multi_select?.map((s) => s.name) || [];
        break;

      case "date":
        result[propertyName] = property.date?.start || null;
        break;

      case "checkbox":
        result[propertyName] = property.checkbox;
        break;

      case "url":
        result[propertyName] = property.url;
        break;

      case "email":
        result[propertyName] = property.email;
        break;

      case "phone_number":
        result[propertyName] = property.phone_number;
        break;

      case "formula":
        if (property.formula?.type === "string") {
          result[propertyName] = property.formula.string;
        } else if (property.formula?.type === "number") {
          result[propertyName] = property.formula.number;
        } else if (property.formula?.type === "boolean") {
          result[propertyName] = property.formula.boolean;
        } else if (property.formula?.type === "date") {
          result[propertyName] = property.formula.date?.start || null;
        }
        break;

      case "people":
        result[propertyName] = property.people?.map((p) => ({
          id: p.id,
          name: p.name,
          avatar_url: p.avatar_url,
        })) || [];
        break;

      case "files":
        result[propertyName] = property.files?.map((f) => ({
          name: f.name,
          url: f.file?.url || f.external?.url || null,
        })) || [];
        break;

      case "relation":
        result[propertyName] = property.relation?.map((r) => r.id) || [];
        break;

      default:
        result[propertyName] = `[Unsupported type: ${property.type}]`;
    }
  }

  return result;
}
