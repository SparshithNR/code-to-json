// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './helpers';

@suite
class TypeSerialiationBoundaryTests {
  @test
  public async 'export const x: number = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export const x: number = 1;');
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Number'],
          typeString: 'number',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export const x = 1;');
    expect(exports.x).to.deep.include({
      name: 'x',
    });
    expect(exports.x.type).to.include({
      typeString: '1',
    });
    expect(exports.x.type!.flags).to.contain('NumberLiteral');
    cleanup();
  }

  @test
  public async 'export let x = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export let x = 1;');
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Number'],
          typeString: 'number',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export let x: string | number = 33;'(): Promise<void> {
    const { exports: allExports, cleanup } = await singleExportModuleExports(
      'export let x: string | number = 33;',
    );
    const { x } = allExports;
    expect(!!x).to.eq(true);
    expect(x.name).to.eq('x');
    expect(x.type).to.be.a('object');
    expect(x.type!.typeString).to.eql('string | number');
    expect(x.type!.flags).to.include('Union');
    cleanup();
  }

  @test
  public async 'export let x: string[] = ["33"];'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      'export let x: string[] = ["33"];',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Reference'],
          libName: 'lib.es5.d.ts',
          typeString: 'string[]',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x: Promise<number> = Promise.resolve(4);'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      'export const x: Promise<number> = Promise.resolve(4);',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          libName: 'lib.es5.d.ts',
          objectFlags: ['Reference'],

          typeString: 'Promise<number>',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };'(): Promise<
    void
  > {
    const { exports, cleanup } = await singleExportModuleExports(
      'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Anonymous'],

          typeString: '{ p: Promise<number[]>; }',
        },
      },
    });
    cleanup();
  }

  @test
  public async "const x: Pick<Promise<number>, 'then'>"(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      `export const x: Pick<Promise<number>, 'then'> = Promise.resolve(4).then;`,
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          libName: 'lib.es5.d.ts',
          objectFlags: ['Mapped', 'Instantiated'],

          typeString: 'Pick<Promise<number>, "then">',
        },
      },
    });
    cleanup();
  }
}
