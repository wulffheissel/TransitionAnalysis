import { writeFile } from 'fs';
import { dialog } from 'electron';

/**
 * Saves a file on the users filesystem.
 * @param filename The name of the file created.
 * @param content The string contents for the new file.
 */
export function saveFile(filename: any, content: string) {
  writeFile(filename.filePath, content, (err) => {
    if (err) {
      dialog.showErrorBox(
        'Error',
        'Something happened while saving your workspace.'
      );
    }
  });
}
