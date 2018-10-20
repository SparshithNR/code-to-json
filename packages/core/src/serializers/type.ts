import { Flags, flagsToString, getObjectFlags } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { isRef, SymbolRef, TypeRef } from '../processing-queue/ref';

export interface SerializedType {
  thing: 'type';
  id: string;
  symbol?: SymbolRef;
  typeString: string;
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  flags?: Flags;
  objectFlags?: Flags;
  defaultType?: TypeRef;
  numberIndexType?: TypeRef;
  constraint?: TypeRef;
  stringIndexType?: TypeRef;
  properties?: SymbolRef[];
  baseTypes?: TypeRef[];
}

export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  queue: ProcessingQueue
): SerializedType {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;
  const objFlags = getObjectFlags(typ);
  const typeData: SerializedType = {
    id: ref.id,
    thing: 'type' as 'type',
    symbol: queue.queue(symbol, 'symbol', checker),
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments
        .map((ata) => queue.queue(ata, 'type', checker))
        .filter(isRef),
    aliasSymbol: aliasSymbol && queue.queue(aliasSymbol, 'symbol', checker),
    flags: flagsToString(flags, 'type'),
    objectFlags: objFlags ? flagsToString(objFlags, 'object') : undefined
  };

  const numberIdxType = typ.getNumberIndexType();
  if (numberIdxType) {
    typeData.numberIndexType = queue.queue(numberIdxType, 'type', checker);
  }
  const stringIdxType = typ.getNumberIndexType();
  if (stringIdxType) {
    typeData.stringIndexType = queue.queue(stringIdxType, 'type', checker);
  }
  const defaultType = typ.getDefault();
  if (defaultType) {
    typeData.defaultType = queue.queue(defaultType, 'type', checker);
  }
  const constraint = typ.getConstraint();
  if (constraint) {
    typeData.constraint = queue.queue(constraint, 'type', checker);
  }
  const baseTypes = typ.getBaseTypes();
  if (baseTypes) {
    typeData.baseTypes = baseTypes
      .map((bt) => queue.queue(bt, 'type', checker))
      .filter(isRef);
  }
  // if (
  //   typ.symbol &&
  //   typ.symbol.valueDeclaration &&
  //   typ.symbol.valueDeclaration.kind !== ts.SyntaxKind.SourceFile
  // ) {
  //   if (properties && properties.length) {
  //     typeData.properties = properties
  //       .map((prop) => queue.queue(prop, 'symbol', checker))
  //       .filter(isRef);
  //   }
  // }

  return typeData;
}
