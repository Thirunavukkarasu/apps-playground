import React from "react";
import type { H5PContent } from "../types";
import { SCHEMA_HELPERS } from "../schemas/h5pSchemas";

interface SchemaHelperProps {
  content: H5PContent;
  onUseExample: (example: H5PContent) => void;
}

export const SchemaHelper: React.FC<SchemaHelperProps> = ({
  content,
  onUseExample,
}) => {
  const schemaHelper =
    SCHEMA_HELPERS[content.mainLibrary as keyof typeof SCHEMA_HELPERS];

  if (!schemaHelper) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Schema helper not available for {content.mainLibrary}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-medium text-blue-900">
            {schemaHelper.title}
          </h4>
          <p className="text-blue-800">{schemaHelper.description}</p>
        </div>
        <button
          onClick={() => onUseExample(schemaHelper.example as H5PContent)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Use Example
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema Structure */}
        <div>
          <h5 className="font-medium text-blue-900 mb-2">Schema Structure:</h5>
          <div className="text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-auto max-h-64">
            <pre>{JSON.stringify(schemaHelper.schema.shape, null, 2)}</pre>
          </div>
        </div>

        {/* Example */}
        <div>
          <h5 className="font-medium text-blue-900 mb-2">Example:</h5>
          <div className="text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-auto max-h-64">
            <pre>{JSON.stringify(schemaHelper.example, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Zod Benefits */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
        <h6 className="font-medium text-green-900 mb-2">
          ✨ Zod Schema Benefits:
        </h6>
        <ul className="text-xs text-green-800 space-y-1">
          <li>
            • <strong>Type Safety:</strong> Compile-time validation and
            IntelliSense
          </li>
          <li>
            • <strong>Runtime Validation:</strong> Automatic error checking
          </li>
          <li>
            • <strong>Auto-completion:</strong> IDE support for field names and
            types
          </li>
          <li>
            • <strong>Documentation:</strong> Built-in field descriptions
          </li>
          <li>
            • <strong>Default Values:</strong> Automatic field population
          </li>
        </ul>
      </div>
    </div>
  );
};
