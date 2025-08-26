# H5P Authoring Interface Guide

## Overview

The H5P setup now includes a comprehensive authoring interface that allows you to edit any content type after creation. This guide explains how to use the new editing features, including a universal JSON editor.

## How to Edit Content

### 1. Create New Content

1. Start the backend server: `cd h5p-backend && npm run dev`
2. Start the frontend server: `cd h5p-frontend && npm run dev`
3. Open http://localhost:5173 in your browser
4. Click any content type in the Quick Create section to create new content

### 2. Access Edit Modes

1. Select any content from the sidebar
2. Choose from three editing modes:
   - **View**: See the content as it appears to users
   - **Edit**: Use custom form-based editors (currently only for Multiple Choice)
   - **JSON Editor**: Edit the raw JSON data directly (works for all content types)

### 3. Using the JSON Editor (Universal Solution)

The JSON Editor works for **all content types** and provides full control over the content structure.

#### Access JSON Editor

1. Select your content from the sidebar
2. Click the "JSON Editor" button
3. The interface will show the raw JSON data in an editable textarea

#### Edit JSON Content

- **Modify any field**: Change titles, questions, answers, settings, etc.
- **Add new fields**: Extend the content structure as needed
- **Validate syntax**: The editor checks for valid JSON format
- **Save changes**: Click "Save JSON" to persist your changes

#### JSON Editor Tips

- **Keep the `id` field unchanged** to maintain content identity
- **Maintain the `mainLibrary` field** for proper rendering
- **Update `updatedAt` timestamp** when making changes
- **Ensure `parameters` structure** matches the content type
- **Use proper JSON syntax** with quotes, commas, and brackets

### 4. Custom Form Editors (Limited)

Currently, only Multiple Choice has a custom form editor:

- **Multiple Choice**: Full form-based editor with question, answers, and settings
- **Other content types**: Use the JSON Editor for now

#### Multiple Choice Form Editor Features

- **Content Title**: Change the title of your content
- **Question**: Edit the main question text
- **Answer Options**: Add/remove answers, mark correct ones
- **Settings**: Configure retry, solutions, pass percentage

### 5. Save and Test

1. Make your edits (in JSON Editor or custom form)
2. Click "Save Changes" or "Save JSON"
3. The content will be updated and saved to the backend
4. Switch to "View" mode to test your content

## Features

### ✅ Implemented

- **Universal JSON Editor**: Edit any content type by modifying raw JSON data
- **Zod Schema Validation**: Type-safe validation with detailed error messages
- **Schema Helper System**: Interactive documentation with examples for each content type
- **JSON Validation**: Syntax checking and error handling
- **Full Multiple Choice Editor**: Complete form for editing questions and answers
- **Dynamic Answer Management**: Add/remove answer options
- **Settings Configuration**: Configure retry, solutions, and pass percentage
- **Real-time Preview**: See changes immediately in the form
- **Backend Integration**: Saves changes to the file system
- **Type Safety**: Full TypeScript support with proper interfaces

### 🔄 Workflow

1. **Create** → New content with default values
2. **Edit** → Use the authoring interface to customize
3. **Save** → Changes are persisted to the backend
4. **View** → Test the content in player mode
5. **Iterate** → Go back to edit mode for further refinements

## Technical Details

### File Structure

```
h5p-frontend/src/
├── components/
│   ├── ContentViewer.tsx          # Main viewer with edit/view toggle
│   ├── SchemaHelper.tsx           # Zod schema documentation component
│   ├── MultipleChoiceEditor.tsx   # New authoring interface
│   └── MultipleChoiceViewer.tsx   # Player interface
└── schemas/
    └── h5pSchemas.ts              # Zod schemas for all content types
```

### Data Flow

1. **Load**: Content loaded from JSON files in `h5p-backend/h5p/content/`
2. **Edit**: Form state managed in React components with Zod validation
3. **Validate**: Zod schemas validate content structure and types
4. **Save**: POST request to `/h5p/editor/:contentId` with validated data
5. **Persist**: Content saved back to JSON files
6. **Reload**: Page refreshes to show updated content

### Supported Content Types

- ✅ **All Content Types**: Full JSON editor support
- ✅ **Multiple Choice**: Custom form editor + JSON editor
- 🔄 **Flashcards**: JSON editor only (custom form coming soon)
- 🔄 **Fill in Blanks**: JSON editor only (custom form coming soon)
- 🔄 **Drag & Drop**: JSON editor only (custom form coming soon)
- 🔄 **Text**: JSON editor only (custom form coming soon)

## Example Usage

### Creating a Programming Quiz

1. Create new multiple choice content
2. Set title: "Programming Languages Quiz"
3. Set question: "Which of the following are programming languages?"
4. Add answers:
   - "JavaScript" (correct: true)
   - "HTML" (correct: false)
   - "Python" (correct: true)
   - "CSS" (correct: false)
5. Configure settings:
   - Enable retry: true
   - Pass percentage: 75%
6. Save and test

### Tips for Better Content

- **Clear Questions**: Write unambiguous questions
- **Balanced Options**: Include both correct and incorrect answers
- **Multiple Correct**: Use multiple correct answers for complex questions
- **Appropriate Difficulty**: Set pass percentage based on difficulty
- **User Experience**: Enable retry and solutions for better learning

## Zod Schema Benefits

The new Zod-based schema system provides several advantages:

### 🛡️ **Type Safety**

- **Compile-time validation**: Catch errors before runtime
- **IntelliSense support**: Auto-completion in IDEs
- **Type inference**: Automatic TypeScript types from schemas

### 📚 **Documentation**

- **Built-in descriptions**: Each field has a description
- **Interactive examples**: Click "Use Example" to populate with sample data
- **Schema visualization**: See the exact structure for each content type

### ✅ **Validation**

- **Runtime validation**: Automatic error checking when saving
- **Detailed error messages**: Clear feedback on what's wrong
- **Default values**: Automatic field population with sensible defaults

### 🔧 **Developer Experience**

- **Schema-first approach**: Define structure once, use everywhere
- **Consistent validation**: Same rules across frontend and backend
- **Easy maintenance**: Update schemas in one place

## Next Steps

The authoring interface can be extended to support other content types:

- Flashcard editor with front/back card management
- Fill in the blanks editor with text and answer management
- Drag & drop editor with item and zone configuration
- Text content editor with rich text support

This provides a solid foundation for a complete H5P authoring system with enterprise-grade validation!
