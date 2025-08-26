import { z } from "zod";

// Base schemas for common fields
const baseMetadataSchema = z.object({
  title: z.string().describe("Content title"),
  language: z.string().default("en"),
  mainLibrary: z.string(),
  preloadedDependencies: z.array(z.object({
    machineName: z.string(),
    majorVersion: z.number(),
    minorVersion: z.number()
  })).default([]),
  embedTypes: z.array(z.string()).default(["div"]),
  license: z.string().default("U"),
  defaultLanguage: z.string().default("en"),
  authors: z.array(z.object({
    name: z.string(),
    role: z.string()
  })).default([{ name: "Default Author", role: "Author" }]),
  licenseVersion: z.string().default("4.0"),
  yearFrom: z.string(),
  yearTo: z.string(),
  changes: z.array(z.unknown()).default([]),
  contentType: z.string().default("Text")
});

// Multiple Choice Schema
export const multipleChoiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  parameters: z.object({
    question: z.string().describe("The main question text"),
    answers: z.array(z.object({
      text: z.string().describe("Answer option text"),
      correct: z.boolean().describe("Whether this answer is correct"),
      tipAndFeedback: z.object({
        tip: z.string().describe("Hint for this answer"),
        chosenFeedback: z.string().describe("Feedback when this answer is selected"),
        notChosenFeedback: z.string().describe("Feedback when this answer is not selected")
      }).optional()
    })).describe("Array of answer options"),
    enableRetry: z.boolean().default(true).describe("Allow users to retry"),
    enableSolutionsButton: z.boolean().default(true).describe("Show solutions button"),
    passPercentage: z.number().min(0).max(100).default(80).describe("Percentage required to pass"),
    showResults: z.boolean().default(true).describe("Show results after submission")
  }),
  mainLibrary: z.literal("H5P.MultipleChoice 1.16"),
  metadata: baseMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

// Fill in the Blanks Schema
export const blanksSchema = z.object({
  id: z.string(),
  title: z.string(),
  parameters: z.object({
    title: z.string().describe("Exercise title"),
    description: z.string().describe("Instructions for students"),
    text: z.string().describe("Content with blanks marked as *correct_answer/alternative*")
  }),
  mainLibrary: z.literal("H5P.Blanks 1.14"),
  metadata: baseMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

// Flashcards Schema
export const flashcardsSchema = z.object({
  id: z.string(),
  title: z.string(),
  parameters: z.object({
    title: z.string().describe("Flashcard set title"),
    description: z.string().describe("Description of the flashcard set"),
    cards: z.array(z.object({
      front: z.string().describe("Front side of the card"),
      back: z.string().describe("Back side of the card")
    })).describe("Array of flashcard pairs"),
    showProgress: z.boolean().default(true).describe("Show progress indicator"),
    autoFlip: z.boolean().default(false).describe("Automatically flip cards"),
    autoFlipDelay: z.number().default(3).describe("Delay in seconds before auto-flip")
  }),
  mainLibrary: z.literal("H5P.Flashcards 1.0"),
  metadata: baseMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

// Drag and Drop Schema
export const dragAndDropSchema = z.object({
  id: z.string(),
  title: z.string(),
  parameters: z.object({
    title: z.string().describe("Exercise title"),
    description: z.string().describe("Instructions for students"),
    draggableItems: z.array(z.object({
      text: z.string().describe("Text to display on the draggable item"),
      correctDropZone: z.number().describe("Index of the correct drop zone")
    })).describe("Array of draggable items"),
    dropZones: z.array(z.object({
      label: z.string().describe("Label for the drop zone"),
      description: z.string().describe("Description of what should be dropped here")
    })).describe("Array of drop zones"),
    showFeedback: z.boolean().default(true).describe("Show feedback after dropping"),
    allowRetry: z.boolean().default(true).describe("Allow users to retry"),
    shuffleItems: z.boolean().default(false).describe("Randomize item order")
  }),
  mainLibrary: z.literal("H5P.DragAndDrop 1.0"),
  metadata: baseMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

// Text Content Schema
export const textSchema = z.object({
  id: z.string(),
  title: z.string(),
  parameters: z.object({
    text: z.string().describe("The text content (can include HTML)")
  }),
  mainLibrary: z.literal("H5P.Text 1.1"),
  metadata: baseMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

// Union type for all content types
export const h5pContentSchema = z.discriminatedUnion("mainLibrary", [
  multipleChoiceSchema,
  blanksSchema,
  flashcardsSchema,
  dragAndDropSchema,
  textSchema
]);

// Schema helpers for UI
export const SCHEMA_HELPERS = {
  "H5P.MultipleChoice 1.16": {
    title: "Multiple Choice Schema",
    description: "Structure for multiple choice questions",
    schema: multipleChoiceSchema,
    example: {
      id: "example-mc",
      title: "Programming Languages Quiz",
      parameters: {
        question: "Which of the following are programming languages?",
        answers: [
          {
            text: "JavaScript",
            correct: true,
            tipAndFeedback: {
              tip: "Think about web development",
              chosenFeedback: "Correct! JavaScript is a programming language.",
              notChosenFeedback: ""
            }
          },
          {
            text: "HTML",
            correct: false,
            tipAndFeedback: {
              tip: "This is a markup language",
              chosenFeedback: "Incorrect! HTML is a markup language, not a programming language.",
              notChosenFeedback: ""
            }
          }
        ],
        enableRetry: true,
        enableSolutionsButton: true,
        passPercentage: 80,
        showResults: true
      },
      mainLibrary: "H5P.MultipleChoice 1.16",
      metadata: {
        title: "Programming Languages Quiz",
        language: "en",
        mainLibrary: "H5P.MultipleChoice 1.16",
        preloadedDependencies: [],
        embedTypes: ["div"],
        license: "U",
        defaultLanguage: "en",
        authors: [{ name: "Default Author", role: "Author" }],
        licenseVersion: "4.0",
        yearFrom: "2025",
        yearTo: "2025",
        changes: [],
        contentType: "Text"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  "H5P.Blanks 1.14": {
    title: "Fill in the Blanks Schema",
    description: "Structure for fill in the blanks exercises",
    schema: blanksSchema,
    example: {
      id: "example-blanks",
      title: "Science Quiz",
      parameters: {
        title: "Science Quiz",
        description: "Fill in the blanks with the correct scientific terms.",
        text: "Water is made of *hydrogen/hydrogen* and *oxygen/oxygen*. Plants use *photosynthesis/photosynthesis* to make food from sunlight."
      },
      mainLibrary: "H5P.Blanks 1.14",
      metadata: {
        title: "Science Quiz",
        language: "en",
        mainLibrary: "H5P.Blanks 1.14",
        preloadedDependencies: [],
        embedTypes: ["div"],
        license: "U",
        defaultLanguage: "en",
        authors: [{ name: "Default Author", role: "Author" }],
        licenseVersion: "4.0",
        yearFrom: "2025",
        yearTo: "2025",
        changes: [],
        contentType: "Text"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  "H5P.Flashcards 1.0": {
    title: "Flashcards Schema",
    description: "Structure for flashcard sets",
    schema: flashcardsSchema,
    example: {
      id: "example-flashcards",
      title: "Vocabulary Flashcards",
      parameters: {
        title: "Vocabulary Flashcards",
        description: "Learn new vocabulary words",
        cards: [
          {
            front: "What is the capital of France?",
            back: "Paris"
          },
          {
            front: "What is 2 + 2?",
            back: "4"
          }
        ],
        showProgress: true,
        autoFlip: false,
        autoFlipDelay: 3
      },
      mainLibrary: "H5P.Flashcards 1.0",
      metadata: {
        title: "Vocabulary Flashcards",
        language: "en",
        mainLibrary: "H5P.Flashcards 1.0",
        preloadedDependencies: [],
        embedTypes: ["div"],
        license: "U",
        defaultLanguage: "en",
        authors: [{ name: "Default Author", role: "Author" }],
        licenseVersion: "4.0",
        yearFrom: "2025",
        yearTo: "2025",
        changes: [],
        contentType: "Text"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  "H5P.DragAndDrop 1.0": {
    title: "Drag and Drop Schema",
    description: "Structure for drag and drop exercises",
    schema: dragAndDropSchema,
    example: {
      id: "example-dragdrop",
      title: "Match the Words",
      parameters: {
        title: "Match the Words",
        description: "Drag each word to its correct category",
        draggableItems: [
          {
            text: "Apple",
            correctDropZone: 0
          },
          {
            text: "Carrot",
            correctDropZone: 0
          },
          {
            text: "Dog",
            correctDropZone: 1
          }
        ],
        dropZones: [
          {
            label: "Fruits & Vegetables",
            description: "Drag food items here"
          },
          {
            label: "Animals",
            description: "Drag animal names here"
          }
        ],
        showFeedback: true,
        allowRetry: true,
        shuffleItems: true
      },
      mainLibrary: "H5P.DragAndDrop 1.0",
      metadata: {
        title: "Match the Words",
        language: "en",
        mainLibrary: "H5P.DragAndDrop 1.0",
        preloadedDependencies: [],
        embedTypes: ["div"],
        license: "U",
        defaultLanguage: "en",
        authors: [{ name: "Default Author", role: "Author" }],
        licenseVersion: "4.0",
        yearFrom: "2025",
        yearTo: "2025",
        changes: [],
        contentType: "Text"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  "H5P.Text 1.1": {
    title: "Text Content Schema",
    description: "Structure for text content",
    schema: textSchema,
    example: {
      id: "example-text",
      title: "Welcome Content",
      parameters: {
        text: "<h2>Welcome to the Course</h2><p>This is an introduction to the topic. You can use <strong>HTML formatting</strong> in your text.</p>"
      },
      mainLibrary: "H5P.Text 1.1",
      metadata: {
        title: "Welcome Content",
        language: "en",
        mainLibrary: "H5P.Text 1.1",
        preloadedDependencies: [],
        embedTypes: ["div"],
        license: "U",
        defaultLanguage: "en",
        authors: [{ name: "Default Author", role: "Author" }],
        licenseVersion: "4.0",
        yearFrom: "2025",
        yearTo: "2025",
        changes: [],
        contentType: "Text"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

// Type exports
export type H5PContent = z.infer<typeof h5pContentSchema>;
export type MultipleChoiceContent = z.infer<typeof multipleChoiceSchema>;
export type BlanksContent = z.infer<typeof blanksSchema>;
export type FlashcardsContent = z.infer<typeof flashcardsSchema>;
export type DragAndDropContent = z.infer<typeof dragAndDropSchema>;
export type TextContent = z.infer<typeof textSchema>;

// Validation function
export const validateH5PContent = (data: unknown): { success: true; data: H5PContent } | { success: false; errors: string[] } => {
  const result = h5pContentSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
};

// Get schema for specific content type
export const getSchemaForContentType = (mainLibrary: string) => {
  return SCHEMA_HELPERS[mainLibrary as keyof typeof SCHEMA_HELPERS];
};
