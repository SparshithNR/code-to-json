import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { asTree, TreeObject } from 'treeify';
import * as ts from 'typescript';
import { setupTestCaseFolder, TestCaseFolder } from './file-fixtures';

const log = debug('code-to-json:test-helpers');

export interface TestCase extends TestCaseFolder {
  program: ts.Program;
}

function createProgramFromTestCaseFolder(
  name: string,
  rootPath: string,
  entryPaths: string[],
  treeFn: () => TreeObject
): ts.Program {
  if (!fs.existsSync(rootPath)) {
    throw new Error(`"${rootPath}" does not exist`);
  }
  if (!fs.statSync(rootPath).isDirectory) {
    throw new Error(`"${rootPath}" is not a folder`);
  }
  const entries = entryPaths.map(pth => path.join(rootPath, pth));
  const entryErrors: { [k: string]: string[] } = {};
  entries.forEach(pth => {
    const localErrors: string[] = [];
    if (!fs.existsSync(pth)) {
      localErrors.push('was not found');
    } else {
      const stats = fs.statSync(pth);
      if (!stats.isFile) {
        localErrors.push('is not a file');
      }
    }
    if (localErrors.length > 0) {
      entryErrors[pth] = localErrors;
    }
  });
  if (Object.keys(entryErrors).length > 0) {
    throw new Error(`One or more problems was detected with the specified entries
${JSON.stringify(entryErrors, null, '  ')}`);
  }
  log(`setting up test case for entries ${entryPaths.map((s: string) => s).join('\n')}`);

  log(`creating typescript program from fixture "${name}"
${rootPath}
${asTree(treeFn(), false, true)}`);
  const program = ts.createProgram({
    rootNames: entries,
    options: {
      allowJs: true,
      noEmit: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs
    }
  });
  return program;
}

/**
 * Create a new test case from fixture files on disk
 *
 * @param cse path to test case fixture
 * @public
 */
export async function setupTestCase(
  cse: TreeObject | string,
  entryPaths: string[]
): Promise<TestCase> {
  const { rootPath, cleanup, tree } = await setupTestCaseFolder(cse);
  const program = createProgramFromTestCaseFolder(
    typeof cse === 'string' ? cse : JSON.stringify(cse, null, '  '),
    rootPath,
    entryPaths,
    tree
  );

  return {
    tree,
    rootPath,
    cleanup,
    program
  };
}
